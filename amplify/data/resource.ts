import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // This model is for storing the magic request and its results
  // This will be used in the future for inventory tracking.
  MagicRequest: a.model({
    prompt: a.string().required(),
    size: a.string().required(),
    response: a.string(),
    status: a.enum(['NEW', 'PROCESSING', 'COMPLETED']),
  }).authorization((allow) => [allow.publicApiKey()]),

  // This is the custom query that invokes the function
  /*
  magicRequest: a
    .query()
    .arguments({
      prompt: a.string().required(),
      size: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function('magicRequest'))
    .authorization((allow) => [allow.publicApiKey()]),
  */
});

export type Schema = typeof schema;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
}); 