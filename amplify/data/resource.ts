import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Schema is currently empty because products are sourced from Shopify.
// We can add models here later for other features like user reviews.
const schema = a.schema({});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // This can be configured when we add models that require authorization.
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
}); 