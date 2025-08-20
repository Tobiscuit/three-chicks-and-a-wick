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
    const query = GET_CUSTOMER_QUERY.loc?.source.body || '';
    console.log('GraphQL Query:', query);
    const result = await customerAccountFetch({
      query,
    });

    if (result.errors) {
      return new Response(JSON.stringify({ errors: result.errors }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    
    if (error instanceof Error && error.message.includes('Missing access token')) {
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
