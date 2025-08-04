import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  MagicRequestResult: a.customType({
    candleName: a.string().required(),
    description: a.string().required(),
  }),
  
  Todo: a.model({
    content: a.string(),
  }).authorization(allow => allow.publicApiKey()),
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