import {
  type ClientSchema,
  a,
  defineData,
  secret
} from '@aws-amplify/backend';
import { magicRequestHandler } from '../functions/magic-request/resource';

// Absolute minimal schema
const schema = a.schema({});

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