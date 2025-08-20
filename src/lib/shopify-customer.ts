import { SHOPIFY_HEADLESS_APP_ID } from './constants';

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

export async function customerAccountFetch<T>({
  query,
  variables,
  accessToken,
  cache = 'force-cache',
}: {
  query: string;
  variables?: Record<string, unknown>;
  accessToken: string;
  cache?: RequestCache;
}): Promise<GraphQLResponse<T>> {
  if (!accessToken) {
    throw new Error('Missing access token for Shopify Customer Account API.');
  }

  if (!SHOPIFY_HEADLESS_APP_ID) {
    throw new Error(
      'Missing Shopify Headless App ID. Please check your .env.local file.'
    );
  }

  const endpoint = `https://shopify.com/${SHOPIFY_HEADLESS_APP_ID}/account/customer/api/2024-07/graphql`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    });

    if (!response.ok) {
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
