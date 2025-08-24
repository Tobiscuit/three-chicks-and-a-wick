import { cookies } from 'next/headers';
import { customerAccountFetch } from '@/lib/shopify';
import { gql } from '@apollo/client';

const GET_CUSTOMER_QUERY = gql`
  query getCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      addresses(first: 5) {
        edges {
          node {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            country
            zip
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    const query = GET_CUSTOMER_QUERY.loc?.source.body;
    if (!query) {
      throw new Error('GraphQL query source not found');
    }

    const { data, errors } = await customerAccountFetch<{ customer: any }>({
      query,
    });

    if (errors) {
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!data?.customer) {
      return new Response(
        JSON.stringify({ error: 'Customer data not found in response' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error fetching customer profile:', error);

    if (error.message.includes('401') || error.message.includes('Missing access token')) {
      return new Response(JSON.stringify({ message: 'Not authenticated' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
