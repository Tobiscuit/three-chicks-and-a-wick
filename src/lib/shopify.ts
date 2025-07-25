// src/lib/shopify.ts

import { SHOPIFY_STOREFRONT_API_TOKEN, SHOPIFY_STORE_DOMAIN } from './constants';
import { gql } from '@apollo/client';

export const CREATE_CART_MUTATION = gql`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_LINE_MUTATION = gql`
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CART_QUERY = gql`
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                product {
                  id
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  }
`;

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
  cache = 'force-cache',
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
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
      cache,
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