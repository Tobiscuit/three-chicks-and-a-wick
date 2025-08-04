import {
  type ClientSchema,
  a,
  defineData,
  secret
} from '@aws-amplify/backend';
import { magicRequestHandler } from '../functions/magic-request/resource';

// Minimal valid schema
const schema = a.schema({
  Todo: a.model({
    content: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
}); 