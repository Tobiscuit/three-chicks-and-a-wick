// src/app/api/customer/orders/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SHOPIFY_SHOP_ID = process.env.SHOPIFY_SHOP_ID;
const CUSTOMER_API_ENDPOINT = `https://shopify.com/authentication/${SHOPIFY_SHOP_ID}/api/2025-07/graphql.json`;

const getCustomerOrdersQuery = `
  query getCustomerOrders($first: Int!) {
    customer {
      orders(first: $first) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('shopify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const response = await fetch(CUSTOMER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: getCustomerOrdersQuery,
        variables: { first: 25 },
      }),
    });

    const responseText = await response.text();
    console.log("Shopify Customer API Raw Response:", responseText);

    if (!response.ok) {
      console.error('Shopify Customer API Error Response:', responseText);
      return NextResponse.json({ error: 'Failed to fetch orders', details: responseText }, { status: response.status });
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse JSON response:', responseText);
      return NextResponse.json({ error: 'Invalid JSON response from Shopify', details: responseText }, { status: 500 });
    }

    if (data.errors) {
      console.error('Shopify Customer API GraphQL Errors:', data.errors);
      return NextResponse.json({ error: 'Failed to fetch orders', details: data.errors }, { status: 400 });
    }

    return NextResponse.json(data.data.customer);
    
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}