// src/lib/client.ts
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

let client: ApolloClient<NormalizedCacheObject> | null = null;

export const getClient = () => {
  // Create a new client if there's no existing one
  // or if we are on the server-side.
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