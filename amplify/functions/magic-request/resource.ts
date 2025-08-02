// amplify/functions/magic-request/resource.ts

import { defineFunction, secret } from '@aws-amplify/backend';

export const magicRequest = defineFunction({
  entry: './handler.ts',
  timeoutSeconds: 20,
  memoryMB: 512,
  environment: {
    GEMINI_API_KEY: secret('GEMINI_API_KEY'),
    SHOPIFY_ADMIN_API_TOKEN: secret('SHOPIFY_ADMIN_API_TOKEN'),
    SHOPIFY_STORE_DOMAIN: secret('SHOPIFY_STORE_DOMAIN'),
  }
});
