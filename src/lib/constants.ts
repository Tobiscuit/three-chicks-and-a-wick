// src/lib/constants.ts

// SHOPIFY HEADLESS APP TOKENS
// From your Shopify Headless app dashboard

// PUBLIC ACCESS TOKEN - Use in client-side contexts (browsers)
// This is safe to expose in client-side code
export const SHOPIFY_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN!;

// PRIVATE ACCESS TOKEN - Use ONLY in server-side contexts (API routes, server components)
// NEVER expose this in client-side code
export const SHOPIFY_PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN!;

// Your Shopify store domain (without https://)
export const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;

// Shopify Headless App ID for Storefront API (f3e6eb8b-6d77-4b30-a920-d0ad79c0ddff)
export const SHOPIFY_HEADLESS_APP_ID = process.env.SHOPIFY_HEADLESS_APP_ID!;

// Customer Account API App ID for authentication endpoints (71225213117)
export const SHOPIFY_CUSTOMER_ACCOUNT_API_APP_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_APP_ID!; 