// scripts/test-customer-api.mjs
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SHOPIFY_SHOP_ID = process.env.SHOPIFY_SHOP_ID;
const CUSTOMER_API_ENDPOINT = `https://shopify.com/authentication/${SHOPIFY_SHOP_ID}/api/2025-07/graphql.json`;

console.log("--- Configuration Values ---");
console.log("Shop ID:", SHOPIFY_SHOP_ID);
console.log("API Endpoint:", CUSTOMER_API_ENDPOINT);
console.log("--------------------------");

// The rest of the script is commented out to prevent the API call.
/*
const CUSTOMER_ACCESS_TOKEN = process.env.TEST_CUSTOMER_ACCESS_TOKEN; // We will add this to .env.local

const getCustomerEmailQuery = `
  query getCustomerEmail {
    customer {
      emailAddress {
        emailAddress
      }
    }
  }
`;

async function testCustomerApi() {
  if (!CUSTOMER_ACCESS_TOKEN) {
    console.error('Error: Please add a TEST_CUSTOMER_ACCESS_TOKEN to your .env.local file.');
    console.log('You can obtain this by logging in and copying the value of the "shopify_access_token" cookie.');
    return;
  }

  console.log(`Attempting to fetch from: ${CUSTOMER_API_ENDPOINT}`);

  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CUSTOMER_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        query: getCustomerEmailQuery,
      }),
    };

    console.log('\n--- Sending Request ---');
    console.log('Method:', requestOptions.method);
    console.log('Endpoint:', CUSTOMER_API_ENDPOINT);
    console.log('Headers:', requestOptions.headers);
    console.log('Body:', requestOptions.body);
    console.log('-----------------------\n');

    const response = await fetch(CUSTOMER_API_ENDPOINT, requestOptions);

    const responseText = await response.text();

    console.log('\n--- Shopify API Response ---');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Headers:', response.headers);
    console.log('Body:', responseText);
    console.log('--------------------------\n');

    if (!response.ok) {
      console.error('Request failed. The response body above contains the error details.');
      return;
    }

    try {
      const data = JSON.parse(responseText);
      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
      } else {
        console.log('Success! Fetched data:', data);
      }
    } catch (error) {
      console.error('Failed to parse JSON. The response was likely HTML.');
    }

  } catch (error) {
    console.error('An error occurred during the fetch operation:', error);
  }
}

testCustomerApi();
*/
