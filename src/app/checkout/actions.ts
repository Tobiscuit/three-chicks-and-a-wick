'use server';

import { redirect } from 'next/navigation';
import { SHOPIFY_PRIVATE_TOKEN, SHOPIFY_STORE_DOMAIN } from '@/lib/constants';

// This is a new, local fetcher that ONLY uses the private token
async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables: Record<string, unknown>;
}): Promise<{ data: T; errors?: { message: string }[] }> {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY_PRIVATE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error in shopifyAdminFetch:', error);
    throw error;
  }
}

const CREATE_CHECKOUT_MUTATION = `
  mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
    checkoutCreate(input: { lineItems: $lineItems }) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

type LineItem = {
  variantId: string;
  quantity: number;
};

type CheckoutCreatePayload = {
  checkoutCreate: {
    checkout: {
      id: string;
      webUrl: string;
    };
    checkoutUserErrors: { message: string }[];
  };
};

export async function createCheckout(lineItems: LineItem[]) {
  // Use the new, secure fetcher
  const { data, errors } = await shopifyAdminFetch<CheckoutCreatePayload>({
    query: CREATE_CHECKOUT_MUTATION,
    variables: { lineItems },
  });

  if (errors || data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
    console.error("Error creating checkout:", errors || data.checkoutCreate.checkoutUserErrors);
    return;
  }

  const checkoutUrl = data?.checkoutCreate?.checkout?.webUrl;

  if (checkoutUrl) {
    redirect(checkoutUrl);
  } else {
    console.error("Checkout URL not found");
  }
} 