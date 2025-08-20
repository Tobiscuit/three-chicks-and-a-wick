// app/ApolloProvider.tsx
"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_PUBLIC_TOKEN } from "@/lib/constants";

function makeClient() {
  const httpLink = new HttpLink({
    uri: `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`,
    headers: {
      "X-Shopify-Storefront-Access-Token": SHOPIFY_PUBLIC_TOKEN,
    },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
} 