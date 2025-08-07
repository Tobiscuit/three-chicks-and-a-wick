// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { defineAuth } from '@aws-amplify/backend-auth';
import { defineSecret } from '@aws-amplify/backend-secret';

const shopifyAdminToken = defineSecret({
  name: 'SHOPIFY_ADMIN_API_TOKEN',
  description: 'Shopify Admin API Access Token',
});

const auth = defineAuth({
  loginWith: {
    email: true,
  },
});

export const backend = defineBackend({
  auth,
  shopifyAdminToken,
});
