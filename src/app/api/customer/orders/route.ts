// src/app/api/customer/orders/route.ts
import { NextResponse } from 'next/server';
import { customerAccountFetch } from '@/lib/shopify'; // Import the centralized fetch function

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
  try {
    const { data, errors } = await customerAccountFetch<{ customer: any }>({
      query: getCustomerOrdersQuery,
      variables: { first: 10 },
    });

    if (errors) {
      // The customerAccountFetch function already logs errors, but we can add more context here if needed
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: errors },
        { status: 400 }
      );
    }

    if (!data?.customer) {
      return NextResponse.json(
        { error: 'Customer data not found in response' },
        { status: 404 }
      );
    }

    return NextResponse.json(data.customer);
  } catch (error: any) {
    // The customerAccountFetch function also logs the error, but we catch here to provide a proper API response
    console.error('Error in GET /api/customer/orders:', error);
    // Check if the error is due to an unauthorized (401) response
    if (error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}