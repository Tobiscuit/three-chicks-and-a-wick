// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend-function';
import { defineHttpApi } from '@aws-amplify/backend-api';
import { defineAuth } from '@aws-amplify/backend-auth';
import { defineSecret } from '@aws-amplify/backend-secret';

const shopifyAdminToken = defineSecret({
  name: 'SHOPIFY_ADMIN_API_TOKEN',
  description: 'Shopify Admin API Access Token',
});

const createCheckoutFunction = defineFunction({
  name: 'create-checkout-function',
  entry: './functions/create-checkout.ts',
  access: {
    secrets: [shopifyAdminToken],
  },
});

const api = defineHttpApi({
  name: 'three-girls-and-a-wick-api',
  paths: {
    '/create-checkout': {
      methods: ['POST'],
      handler: createCheckoutFunction,
    },
  },
  authorization: {
    apiKey: {
      name: 'default',
      description: 'Default API Key for the app',
    },
  },
});

const auth = defineAuth({
  loginWith: {
    email: true,
  },
});

export const backend = defineBackend({
  auth,
  api,
  createCheckoutFunction,
  shopifyAdminToken,
});
