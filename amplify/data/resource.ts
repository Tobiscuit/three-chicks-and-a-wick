import {
  type ClientSchema,
  a,
  defineData,
  secret
} from '@aws-amplify/backend';
import { magicRequestHandler } from '../functions/magic-request/resource';

// 2. Define a minimal schema to test
const schema = a.schema({
  MagicRequest: a.model({
    prompt: a.string().required(),
    size: a.string().required(),
    response: a.string(),
    status: a.enum(['NEW', 'PROCESSING', 'COMPLETED']),
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