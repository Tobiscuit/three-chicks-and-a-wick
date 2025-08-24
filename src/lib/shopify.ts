// src/lib/shopify.ts

// Import both public and private tokens
import {
  SHOPIFY_PUBLIC_TOKEN,
  SHOPIFY_PRIVATE_TOKEN,
  SHOPIFY_STORE_DOMAIN,
} from './constants';
import { gql } from '@apollo/client';
import { cookies } from 'next/headers';

// Get the Shop ID from environment variables
const SHOPIFY_SHOP_ID = process.env.SHOPIFY_SHOP_ID;

// Customer Account API URL follows a static pattern when using OAuth
// Format: https://shopify.com/{shop_id}/account/customer/api/{api_version}/graphql
function getCustomerAccountApiUrl(apiVersion: string = '2025-07') {
  if (!SHOPIFY_SHOP_ID) {
    throw new Error('SHOPIFY_SHOP_ID is not configured in environment variables');
  }
  
  // This is the correct pattern for Customer Account API with OAuth
  const customerAccountApiUrl = `https://shopify.com/${SHOPIFY_SHOP_ID}/account/customer/api/${apiVersion}/graphql`;
  
  console.log('--- Customer Account API URL ---');
  console.log('Shop ID:', SHOPIFY_SHOP_ID);
  console.log('API Version:', apiVersion);
  console.log('Constructed URL:', customerAccountApiUrl);
  console.log('---------------------------------');
  
  return customerAccountApiUrl;
}

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
  cache = 'no-store', // Changed from 'force-cache' to 'no-store'
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<GraphQLResponse<T>> {
  const apiVersion = '2025-07';
  // Get the static Customer Account API URL
  const endpoint = getCustomerAccountApiUrl(apiVersion);
  console.log('Customer Account API Endpoint:', endpoint);

  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get('shopify_access_token');
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;
  
  console.log('--- Customer Account API Request ---');
  console.log('Has access token:', !!accessToken);
  console.log('Access token (first 10 chars):', accessToken ? accessToken.substring(0, 10) + '...' : 'None');
  console.log('-------------------------------------');

  if (!accessToken) {
    throw new Error('Missing access token for Shopify Customer Account API. User may not be logged in.');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        // Origin header is important for CORS
        'Origin': process.env.NEXT_PUBLIC_BASE_URL || '',
      },
      body: JSON.stringify({ query, variables }),
      cache,
    });

    if (!response.ok) {
      const responseBody = await response.text();
      const requestId = response.headers.get('x-request-id');
      console.error('--- Shopify Customer Account API Call Failed ---');
      console.error(`Request ID (x-request-id): ${requestId || 'Not found'}`);
      console.error('Status:', response.status, response.statusText);
      console.error('Response Body:', responseBody);
      console.error('------------------------------------------------');
      
      // Try to parse error details if JSON
      try {
        const errorData = JSON.parse(responseBody);
        console.error('Parsed Error Data:', errorData);
      } catch {
        // Response wasn't JSON, that's okay
      }
      
      throw new Error(
        `Shopify Customer Account API response was not ok: ${response.status} ${response.statusText}`
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