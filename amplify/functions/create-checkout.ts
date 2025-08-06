// amplify/functions/create-checkout.ts
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { env } from '$amplify/env/create-checkout-function';
import { StandardItem, CustomCandleItem } from '../../../src/context/cart-store';

type CartItem = StandardItem | CustomCandleItem;

// A simple interface for the expected request body
interface CreateCheckoutRequest {
  items: CartItem[];
}

// A helper to create a line item for the Shopify Draft Order API
const createShopifyLineItem = (item: CartItem): object => {
  if (item.type === 'STANDARD') {
    return {
      variant_id: item.variantId,
      quantity: item.quantity,
    };
  } else {
    // --- DYNAMIC PRICING LOGIC FOR CUSTOM CANDLES GOES HERE ---
    // 1. Fetch the base variant price from Shopify based on size/jar/wick.
    //    (For now, we'll use a placeholder price).
    const basePrice = 42.0; 
    
    // 2. Add upcharges based on business logic.
    const scentUpcharge = Math.max(0, item.configuration.scentRecipe.materialCount - 3) * 2;
    const finalPrice = basePrice + scentUpcharge;

    // 3. Construct the custom line item for Shopify.
    return {
      title: `Your Custom 'Cozy Library' Candle`, // This can be dynamically generated
      price: finalPrice.toFixed(2),
      quantity: 1, // Custom candles are always unique
      custom_attributes: [
        { key: "Size", value: item.configuration.size },
        { key: "Jar", value: item.configuration.jarType },
        { key: "Scent", value: item.configuration.scentRecipe.materials.join(', ') }
      ]
    };
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (event.requestContext.http.method !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const body: CreateCheckoutRequest = event.body ? JSON.parse(event.body) : { items: [] };

    if (!body.items || body.items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Cart is empty' }),
      };
    }
    
    // Construct the line items for the Shopify Draft Order
    const lineItems = body.items.map(createShopifyLineItem);

    const draftOrderPayload = {
      draft_order: {
        line_items: lineItems,
      },
    };

    const shopifyEndpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/draft_orders.json`;
    
    const shopifyResponse = await fetch(shopifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify(draftOrderPayload),
    });

    if (!shopifyResponse.ok) {
      const errorBody = await shopifyResponse.text();
      console.error('Shopify API Error:', errorBody);
      throw new Error(`Shopify API responded with status ${shopifyResponse.status}`);
    }

    const responseData = await shopifyResponse.json();
    const invoiceUrl = responseData.draft_order?.invoice_url;

    if (!invoiceUrl) {
      console.error('Invoice URL not found in Shopify response:', responseData);
      throw new Error('Failed to retrieve checkout URL from Shopify.');
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_url: invoiceUrl }),
    };

  } catch (error) {
    console.error('Error creating checkout:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
