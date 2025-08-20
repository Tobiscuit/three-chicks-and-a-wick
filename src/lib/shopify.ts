// src/lib/shopify.ts

// Import both public and private tokens
import {
  SHOPIFY_PUBLIC_TOKEN,
  SHOPIFY_PRIVATE_TOKEN,
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_CUSTOMER_ACCOUNT_API_APP_ID,
} from './constants';
import { gql } from '@apollo/client';
import { cookies } from 'next/headers';

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
            attributes { key value }
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
  // This check now uses the correct variable name
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_PUBLIC_TOKEN) {
    throw new Error(
      'Missing Shopify environment variables. Please check your .env.local file.'
    );
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-07/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        // This now sends the correct public token
        'X-Shopify-Storefront-Access-Token': SHOPIFY_PUBLIC_TOKEN,
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
    }

    return result;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}

export async function customerAccountFetch<T>({
  query,
  variables,
  cache = 'force-cache',
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<GraphQLResponse<T>> {
  const apiVersion = '2025-07';
  const endpoint = `https://shopify.com/${process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_APP_ID}/account/customer/api/${apiVersion}/graphql`;

  const accessToken = (await cookies()).get('shopify_access_token')?.value;
  console.log('Using access token:', accessToken);

  if (!accessToken) {
    throw new Error('Missing access token for Shopify Customer Account API.');
  }

  if (!SHOPIFY_CUSTOMER_ACCOUNT_API_APP_ID) {
    throw new Error(
      'Missing Shopify Customer Account API App ID. Please check your .env.local file.'
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Origin': process.env.NEXT_PUBLIC_BASE_URL || '',
      },
      body: JSON.stringify({ query, variables }),
      cache,
    });

    if (!response.ok) {
      const responseBody = await response.text();
      const requestId = response.headers.get('x-request-id');
      console.error('--- Shopify API Call Failed ---');
      console.error(`Request ID (x-request-id): ${requestId || 'Not found'}`);
      console.error('Full Shopify Customer Account API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: responseBody,
      });
      throw new Error(
        `Shopify Customer Account API response was not ok: ${response.statusText}`
      );
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors) {
      console.error('Shopify Customer Account GraphQL Errors:', result.errors);
    }

    return result;
  } catch (error) {
    console.error('Error fetching from Shopify Customer Account API:', error);
    throw error;
  }
}

// Server-side Storefront API fetch using PRIVATE token
export async function shopifyServerFetch<T>({
  query,
  variables,
  cache = 'force-cache',
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<GraphQLResponse<T>> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_PRIVATE_TOKEN) {
    throw new Error(
      'Missing Shopify environment variables. Please check your .env.local file.'
    );
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-07/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_PRIVATE_TOKEN,
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
    }

    return result;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}