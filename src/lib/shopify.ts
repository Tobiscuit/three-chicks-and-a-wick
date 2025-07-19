// src/lib/shopify.ts

import { SHOPIFY_STOREFRONT_API_TOKEN, SHOPIFY_STORE_DOMAIN } from './constants';

type GraphQLError = {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
};

type GraphQLResponse<T> = {
  data: T;
  errors?: GraphQLError[];
};

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<GraphQLResponse<T>> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_API_TOKEN) {
    throw new Error(
      'Missing Shopify environment variables. Please check your .env.local file.'
    );
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API response was not ok: ${response.statusText}`);
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors) {
      console.error('Shopify GraphQL Errors:', result.errors);
      // Depending on the use case, you might want to throw an error here
      // or handle it differently.
    }

    return result;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
} 