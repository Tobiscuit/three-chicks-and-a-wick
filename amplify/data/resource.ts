import {
  type ClientSchema,
  a,
  defineData,
  secret
} from '@aws-amplify/backend';
import { magicRequestHandler } from '../functions/magic-request/resource';

// 2. Define the schema and the custom query
const schema = a.schema({
  MagicRequestResult: a.customType({
    candleName: a.string().required(),
    description: a.string().required(),
  }),

  magicRequest: a
    .query()
    .arguments({
      prompt: a.string().required(),
      size: a.string().required(),
    })
    .returns(a.ref('MagicRequestResult'))
    .authorization(allow => [allow.publicApiKey()])
    // 3. Pass the function *object* as the handler
    .handler(a.handler.function(magicRequestHandler)),

  // We will still define a model for future inventory tracking,
  // but it is not directly involved in the query.
  MagicRequest: a.model({
    prompt: a.string().required(),
    size: a.string().required(),
    response: a.string(),
    status: a.enum(['NEW', 'PROCESSING', 'COMPLETED']),
  }).authorization((allow) => [allow.publicApiKey()]),
});

// The client-side schema doesn't need to know about the model
export type Schema = ClientSchema<Omit<typeof schema, 'MagicRequest'>>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
}); 