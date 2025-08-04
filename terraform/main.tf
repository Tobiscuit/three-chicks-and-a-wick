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
      }
    ]
  })
}

# Lambda function
resource "aws_lambda_function" "magic_request_handler" {
  filename         = "lambda/magic-request.zip"
  function_name    = "${var.project_name}-magic-request"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs20.x"
  timeout         = 30

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.magic_requests.name
      GEMINI_API_KEY = var.gemini_api_key
      SHOPIFY_ADMIN_API_TOKEN = var.shopify_admin_api_token
      SHOPIFY_STORE_DOMAIN = var.shopify_store_domain
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
        Resource = aws_lambda_function.magic_request_handler.arn
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

# AppSync Resolver for magicRequest query
resource "aws_appsync_resolver" "magic_request" {
  api_id      = aws_appsync_graphql_api.main.id
  field       = "magicRequest"
  type        = "Query"
  data_source = aws_appsync_datasource.lambda.name

  request_template = jsonencode({
    version = "2017-02-28"
    operation = "Invoke"
    payload = {
      arguments = "$context.arguments"
    }
  })

  response_template = "$context.result"
}