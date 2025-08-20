// src/lib/debug-apollo.ts
// Temporary debug utility to test your Shopify connection

import { SHOPIFY_STORE_DOMAIN, SHOPIFY_PUBLIC_TOKEN } from './constants';

export async function testShopifyConnection() {
  console.log('🔍 Testing Shopify connection...');
  console.log('Store Domain:', SHOPIFY_STORE_DOMAIN);
  console.log('Token exists:', !!SHOPIFY_PUBLIC_TOKEN);
  console.log('Token length:', SHOPIFY_PUBLIC_TOKEN?.length);
  console.log('Token (first 10 chars):', SHOPIFY_PUBLIC_TOKEN?.substring(0, 10) + '...');
  
  // Check if variables are properly loaded
  if (!SHOPIFY_STORE_DOMAIN) {
    return { success: false, error: 'SHOPIFY_STORE_DOMAIN is not set' };
  }
  
  if (!SHOPIFY_PUBLIC_TOKEN) {
    return { success: false, error: 'SHOPIFY_PUBLIC_TOKEN is not set' };
  }

  const testQuery = `
    query {
      shop {
        name
        description
      }
    }
  `;

  const url = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`;
  console.log('Full URL:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_PUBLIC_TOKEN,
      },
      body: JSON.stringify({ query: testQuery }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('❌ Response not OK:', responseText);
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${responseText}`,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };
    }

    const data = JSON.parse(responseText);
    console.log('✅ Success! Response data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Call this in your browser console or component to test
if (typeof window !== 'undefined') {
  (window as unknown).testShopifyConnection = testShopifyConnection;
}