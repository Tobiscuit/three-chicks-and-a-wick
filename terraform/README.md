# Terraform Infrastructure for Three Girls and a Wick

This Terraform configuration creates:
- AppSync GraphQL API
- Lambda function for magic candle requests
- DynamoDB table for data storage
- IAM roles and permissions

## Setup

1. Copy `terraform.tfvars.example` to `terraform.tfvars`
2. Fill in your API keys and configuration
3. Run `deploy.bat` to deploy the infrastructure

## What it creates

- **GraphQL API**: AppSync API with custom query `magicRequest`
- **Lambda Function**: Handles Gemini AI and Shopify integration
- **DynamoDB Table**: Stores candle request data
- **IAM Roles**: Proper permissions for all services

## Usage

After deployment, you'll get:
- GraphQL API URL
- API Key for authentication

Use these in your Next.js frontend to replace the Amplify configuration.