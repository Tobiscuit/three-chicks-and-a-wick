variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "three-girls-and-a-wick"
}

variable "gemini_api_key" {
  description = "Google Gemini API key"
  type        = string
  sensitive   = true
}

variable "gemini_model" {
  description = "Google Gemini model id (e.g., gemini-2.5-pro)"
  type        = string
  default     = "gemini-1.5-flash"
}

variable "shopify_admin_api_token" {
  description = "Shopify Admin API token"
  type        = string
  sensitive   = true
}

variable "shopify_store_domain" {
  description = "Shopify store domain"
  type        = string
  sensitive   = true
}

variable "shopify_storefront_api_token" {
  description = "Shopify Storefront API token"
  type        = string
  sensitive   = true
}

// preview_mode removed; AI is always on
