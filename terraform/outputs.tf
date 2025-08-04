output "graphql_url" {
  description = "GraphQL API URL"
  value       = aws_appsync_graphql_api.main.uris["GRAPHQL"]
}

output "api_key" {
  description = "API Key for GraphQL API"
  value       = aws_appsync_api_key.main.key
  sensitive   = true
}

output "api_id" {
  description = "AppSync API ID"
  value       = aws_appsync_graphql_api.main.id
}