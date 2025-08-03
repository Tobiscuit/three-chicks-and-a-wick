import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // This is the custom query that invokes the simplified echo function
  magicRequest: a
    .query()
    .arguments({
      prompt: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.function('magicRequest'))
    .authorization((allow) => [allow.publicApiKey()]),
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