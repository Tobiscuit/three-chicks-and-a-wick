'use server';

import { redirect } from 'next/navigation';
import { SHOPIFY_PRIVATE_TOKEN, SHOPIFY_STORE_DOMAIN } from '@/lib/constants';

async function shopifyAdminFetch<T>({ query, variables }: { query: string; variables: T }) {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_PRIVATE_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  } catch (error) {
    console.error("Error in Shopify Admin fetch:", error);
    throw new Error('Could not fetch from Shopify Admin API.');
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
    checkoutUserErrors: {
      code: string;
      field: string[];
      message: string;
    }[];
  };
};


export async function createCheckout(lineItems: LineItem[]) {
  const { data, errors } = await shopifyAdminFetch({
    query: CREATE_CHECKOUT_MUTATION,
    variables: { lineItems },
  });

  if (errors || data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
    console.error("Error creating checkout:", errors || data.checkoutCreate.checkoutUserErrors);
    // Handle errors appropriately, e.g., show a message to the user
    return;
  }

  const checkoutUrl = data?.checkoutCreate?.checkout?.webUrl;

  if (checkoutUrl) {
    redirect(checkoutUrl);
  } else {
    console.error("Checkout URL not found");
    // Handle the case where the URL is not returned
  }
} 