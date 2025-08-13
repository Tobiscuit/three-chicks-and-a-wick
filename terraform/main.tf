terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
# SQS queue for async preview jobs
resource "aws_sqs_queue" "preview_jobs" {
  name                      = "${var.project_name}-preview-jobs"
  visibility_timeout_seconds = 360
  message_retention_seconds = 86400
}

# DynamoDB table for preview jobs
resource "aws_dynamodb_table" "preview_jobs" {
  name           = "${var.project_name}-preview-jobs"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "jobId"

  attribute {
    name = "jobId"
    type = "S"
  }
}

# Worker Lambda for processing preview jobs
resource "aws_lambda_function" "preview_worker" {
  filename         = "lambda/magic-request.zip"
  source_code_hash = filebase64sha256("lambda/magic-request.zip")
  function_name    = "${var.project_name}-preview-worker"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.previewWorkerHandler"
  runtime          = "nodejs20.x"
  timeout          = 300
  memory_size      = 3008

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = {
      GEMINI_API_KEY = var.gemini_api_key
      GEMINI_MODEL   = var.gemini_model
      PREVIEW_JOBS_TABLE = aws_dynamodb_table.preview_jobs.name
      SHOPIFY_STOREFRONT_API_TOKEN = var.shopify_storefront_api_token
      SHOPIFY_STORE_DOMAIN         = var.shopify_store_domain
    }
  }
}

resource "aws_lambda_event_source_mapping" "preview_worker_sqs" {
  event_source_arn = aws_sqs_queue.preview_jobs.arn
  function_name    = aws_lambda_function.preview_worker.arn
  batch_size       = 1
}

# IAM policy to allow worker to read/write preview jobs table and SQS
resource "aws_iam_role_policy" "lambda_preview_policy" {
  name = "${var.project_name}-lambda-preview-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:GetItem"],
        Resource = aws_dynamodb_table.preview_jobs.arn
      },
      {
        Effect   = "Allow",
        Action   = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
        Resource = aws_sqs_queue.preview_jobs.arn
      }
    ]
  })
}


# DynamoDB table for data storage
resource "aws_dynamodb_table" "magic_requests" {
  name           = "${var.project_name}-magic-requests"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "${var.project_name}-magic-requests"
  }
}

# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Lambda
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.project_name}-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.magic_requests.arn
      },
      {
        Effect = "Allow",
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
        ],
        Resource = "*"
      }
    ]
  })
}

# Lambda function
resource "aws_lambda_function" "magic_request_handler" {
  filename         = "lambda/magic-request.zip"
  source_code_hash = filebase64sha256("lambda/magic-request.zip")
  function_name    = "${var.project_name}-magic-request"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.magicRequestHandler"
  runtime         = "nodejs20.x"
  timeout         = 30

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.magic_requests.name
      GEMINI_API_KEY = var.gemini_api_key
      GEMINI_MODEL   = var.gemini_model
      SHOPIFY_ADMIN_API_TOKEN = var.shopify_admin_api_token
      SHOPIFY_STORE_DOMAIN = var.shopify_store_domain
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# Lambda for Magic Request V2 (JSON-mode preview)
resource "aws_lambda_function" "magic_request_v2_handler" {
  filename         = "lambda/magic-request.zip"
  source_code_hash = filebase64sha256("lambda/magic-request.zip")
  function_name    = "${var.project_name}-magic-request-v2"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.magicRequestV2Handler"
  runtime          = "nodejs20.x"
  timeout          = 120
  memory_size      = 3008

  environment {
    variables = {
      GEMINI_API_KEY = var.gemini_api_key
      GEMINI_MODEL   = var.gemini_model
      DIAGNOSTIC_HELLO = "0"
      PREVIEW_JOBS_TABLE = aws_dynamodb_table.preview_jobs.name
      PREVIEW_JOBS_QUEUE_URL = aws_sqs_queue.preview_jobs.id
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# AppSync GraphQL API
resource "aws_appsync_graphql_api" "main" {
  name                = "${var.project_name}-api"
  authentication_type = "API_KEY"

  schema = file("${path.module}/schema.graphql")
}

# AppSync API Key
resource "aws_appsync_api_key" "main" {
  api_id  = aws_appsync_graphql_api.main.id
  expires = timeadd(timestamp(), "8760h")
}

# IAM role for AppSync
resource "aws_iam_role" "appsync_role" {
  name = "${var.project_name}-appsync-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "appsync.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for AppSync to invoke Lambda
resource "aws_iam_role_policy" "appsync_lambda_policy" {
  name = "${var.project_name}-appsync-lambda-policy"
  role = aws_iam_role.appsync_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = [
          aws_lambda_function.magic_request_handler.arn,
          aws_lambda_function.add_to_cart_handler.arn,
          aws_lambda_function.create_cart_with_custom_item_handler.arn,
          aws_lambda_function.magic_request_v2_handler.arn
        ]
      }
    ]
  })
}

# AppSync Data Source for Lambda
resource "aws_appsync_datasource" "lambda" {
  api_id           = aws_appsync_graphql_api.main.id
  name             = "lambda_datasource"
  service_role_arn = aws_iam_role.appsync_role.arn
  type             = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.magic_request_handler.arn
  }
}

# Data source for V2
resource "aws_appsync_datasource" "lambda_magic_v2" {
  api_id           = aws_appsync_graphql_api.main.id
  name             = "lambda_magic_v2_datasource"
  service_role_arn = aws_iam_role.appsync_role.arn
  type             = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.magic_request_v2_handler.arn
  }
}

# AppSync Data Source for Create Checkout Lambda
resource "aws_appsync_datasource" "lambda_create_checkout" {
  api_id           = aws_appsync_graphql_api.main.id
  name             = "lambda_create_checkout_datasource"
  service_role_arn = aws_iam_role.appsync_role.arn
  type             = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.create_checkout_handler.arn
  }
}

# AppSync Data Source for Add To Cart Lambda
resource "aws_appsync_datasource" "lambda_add_to_cart" {
  api_id           = aws_appsync_graphql_api.main.id
  name             = "lambda_add_to_cart_datasource"
  service_role_arn = aws_iam_role.appsync_role.arn
  type             = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.add_to_cart_handler.arn
  }
}

# AppSync Data Source for Create Cart With Custom Item Lambda
resource "aws_appsync_datasource" "lambda_create_cart_with_custom_item" {
  api_id           = aws_appsync_graphql_api.main.id
  name             = "lambda_create_cart_with_custom_item_datasource"
  service_role_arn = aws_iam_role.appsync_role.arn
  type             = "AWS_LAMBDA"

  lambda_config {
    function_arn = aws_lambda_function.create_cart_with_custom_item_handler.arn
  }
}

# AppSync Resolver for magicRequest query
resource "aws_appsync_resolver" "magic_request" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "magicRequest"
  type        = "Query"
  data_source = aws_appsync_datasource.lambda.name

  request_template = <<EOF
{
    "version": "2017-02-28",
    "operation": "Invoke",
    "payload": {
        "arguments": $utils.toJson($context.arguments)
    }
}
EOF

  response_template = "$util.toJson($context.result)"
}

resource "aws_appsync_resolver" "magic_request_v2" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "magicRequestV2"
  type        = "Query"
  data_source = aws_appsync_datasource.lambda_magic_v2.name

  request_template = <<EOF
{
    "version": "2017-02-28",
    "operation": "Invoke",
    "payload": {
        "arguments": $utils.toJson($context.arguments)
    }
}
EOF

  response_template = "$util.toJson($context.result)"
}

# AppSync Resolver to start preview job (sync)
resource "aws_appsync_resolver" "start_magic_preview" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "startMagicPreview"
  type        = "Mutation"
  data_source = aws_appsync_datasource.lambda_magic_v2.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "arguments": $utils.toJson($context.arguments),
    "action": "start"
  }
}
EOF

  response_template = "$util.toJson($context.result)"
}

# AppSync Resolver to get preview job status
resource "aws_appsync_resolver" "magic_preview_job" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "magicPreviewJob"
  type        = "Query"
  data_source = aws_appsync_datasource.lambda_magic_v2.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "arguments": $utils.toJson($context.arguments),
    "action": "get"
  }
}
EOF

  response_template = "$util.toJson($context.result)"
}

# New resolvers for async Magic Request (scaffold to same Lambda, different action)
resource "aws_appsync_resolver" "start_magic_request" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "startMagicRequest"
  type        = "Mutation"
  data_source = aws_appsync_datasource.lambda_magic_v2.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "arguments": $utils.toJson($context.arguments),
    "action": "start"
  }
}
EOF

  response_template = "$util.toJson($context.result)"
}

resource "aws_appsync_resolver" "get_magic_request_status" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "getMagicRequestStatus"
  type        = "Query"
  data_source = aws_appsync_datasource.lambda_magic_v2.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "arguments": $utils.toJson($context.arguments),
    "action": "get"
  }
}
EOF

  response_template = "$util.toJson($context.result)"
}

resource "aws_appsync_resolver" "share_candle" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "shareCandle"
  type        = "Mutation"
  data_source = aws_appsync_datasource.lambda_magic_v2.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "arguments": $utils.toJson($context.arguments),
    "action": "share"
  }
}
EOF

  response_template = "$util.toJson($context.result)"
}

resource "aws_appsync_resolver" "get_community_creations" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "getCommunityCreations"
  type        = "Query"
  data_source = aws_appsync_datasource.lambda_magic_v2.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "arguments": $utils.toJson($context.arguments),
    "action": "community"
  }
}
EOF

  response_template = "$util.toJson($context.result)"
}

# Lambda function for creating a checkout
resource "aws_lambda_function" "create_checkout_handler" {
  filename         = "lambda/magic-request.zip" # We'll use the same zip file
  source_code_hash = filebase64sha256("lambda/magic-request.zip")
  function_name    = "${var.project_name}-create-checkout"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.createCheckoutHandler" # New handler
  runtime         = "nodejs20.x"
  timeout         = 30

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.magic_requests.name
      GEMINI_API_KEY = var.gemini_api_key
      GEMINI_MODEL   = var.gemini_model
      SHOPIFY_ADMIN_API_TOKEN = var.shopify_admin_api_token
      SHOPIFY_STORE_DOMAIN = var.shopify_store_domain
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# AppSync Resolver for createCheckout mutation
// Removed createCheckout resolver; field not present in schema

# Lambda function for adding a custom product to the cart
resource "aws_lambda_function" "add_to_cart_handler" {
  filename         = "lambda/magic-request.zip" # We'll use the same zip file for now
  source_code_hash = filebase64sha256("lambda/magic-request.zip")
  function_name    = "${var.project_name}-add-to-cart"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.addToCartHandler" # New handler
  runtime          = "nodejs20.x"
  timeout          = 30

  environment {
    variables = {
      SHOPIFY_STOREFRONT_API_TOKEN = var.shopify_storefront_api_token
      SHOPIFY_STORE_DOMAIN       = var.shopify_store_domain
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# AppSync Resolver for addToCart mutation
resource "aws_appsync_resolver" "add_to_cart" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "addToCart"
  type        = "Mutation"
  data_source = aws_appsync_datasource.lambda_add_to_cart.name

  request_template = <<EOF
{
    "version": "2017-02-28",
    "operation": "Invoke",
    "payload": {
        "arguments": $utils.toJson($context.arguments)
    }
}
EOF

  response_template = "$util.toJson($context.result)"
}

# Lambda function for creating a cart with a custom item
resource "aws_lambda_function" "create_cart_with_custom_item_handler" {
  filename         = "lambda/magic-request.zip"
  source_code_hash = filebase64sha256("lambda/magic-request.zip")
  function_name    = "${var.project_name}-create-cart-with-custom-item"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.createCartWithCustomItemHandler" # New handler
  runtime          = "nodejs20.x"
  timeout          = 30

  environment {
    variables = {
      SHOPIFY_STOREFRONT_API_TOKEN = var.shopify_storefront_api_token
      SHOPIFY_STORE_DOMAIN       = var.shopify_store_domain
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# AppSync Resolver for createCartWithCustomItem mutation
resource "aws_appsync_resolver" "create_cart_with_custom_item" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "createCartWithCustomItem"
  type        = "Mutation"
  data_source = aws_appsync_datasource.lambda_create_cart_with_custom_item.name

  request_template = <<EOF
{
    "version": "2017-02-28",
    "operation": "Invoke",
    "payload": {
        "arguments": $utils.toJson($context.arguments)
    }
}
EOF

  response_template = "$util.toJson($context.result)"
}
