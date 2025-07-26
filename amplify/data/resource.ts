import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      image: a.url(),
      isFeatured: a.boolean().default(false),
    })
    .authorization((allow) => [allow.guest().to(['read'])]),
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