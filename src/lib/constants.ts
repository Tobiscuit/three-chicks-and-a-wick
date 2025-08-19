// src/lib/constants.ts

// This is your PRIVATE, server-only token for mutations like checkout
export const SHOPIFY_PRIVATE_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

// This is your PUBLIC, client-safe token for reading product data
export const SHOPIFY_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN!;

// The store domain is public and can use the public variable
export const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;

export const SHOPIFY_HEADLESS_APP_ID = process.env.NEXT_PUBLIC_SHOPIFY_HEADLESS_APP_ID!;