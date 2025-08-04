import { defineFunction } from '@aws-amplify/backend';

export const magicRequestHandler = defineFunction({
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
  environment: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
    SHOPIFY_ADMIN_API_TOKEN: process.env.SHOPIFY_ADMIN_API_TOKEN!,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN!,
  }
});