// src/lib/client.ts
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { createRestApiHandler } from 'aws-amplify/api-client';
import { backend } from '../../amplify/backend';

let client: ApolloClient<NormalizedCacheObject> | null = null;

export const getClient = () => {
  if (!client || typeof window === 'undefined') {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`,
        headers: {
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN || "",
        },
      }),
    });
  }
  return client;
};

// Create and export the Amplify API client
export const amplifyApiClient = createRestApiHandler(backend.api.name);
