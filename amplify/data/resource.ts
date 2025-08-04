import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
  secret
} from '@aws-amplify/backend';

// 1. Define the function that will be the handler
const magicRequestHandler = defineFunction({
  entry: '../functions/magic-request/handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
  environment: {
    // We must use the secret() macro here as shown in documentation
    GEMINI_API_KEY: secret('GEMINI_API_KEY'),
    SHOPIFY_ADMIN_API_TOKEN: secret('SHOPIFY_ADMIN_API_TOKEN'),
    SHOPIFY_STORE_DOMAIN: secret('SHOPIFY_STORE_DOMAIN'),
  }
});

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