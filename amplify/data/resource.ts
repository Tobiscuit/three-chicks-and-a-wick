import { a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // This is the simplest possible custom query for our diagnostic test.
  echo: a
    .query()
    .arguments({
      message: a.string().required(),
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