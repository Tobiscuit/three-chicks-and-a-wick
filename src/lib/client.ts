// src/lib/client.ts
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_PUBLIC_TOKEN } from "./constants";

let client: ApolloClient<NormalizedCacheObject> | null = null;

export const getClient = () => {
  // Create a new client if there's no existing one
  // or if we are on the server-side.
  if (!client || typeof window === 'undefined') {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`,
        headers: {
          "X-Shopify-Storefront-Access-Token": SHOPIFY_PUBLIC_TOKEN,
        },
      }),
    });
  }

  return client;
}; 