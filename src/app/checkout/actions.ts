'use server';

import { shopifyFetch } from '@/lib/shopify';
import { redirect } from 'next/navigation';

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
  const { data, errors } = await shopifyFetch<CheckoutCreatePayload>({
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