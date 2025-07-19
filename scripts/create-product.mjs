// We'll use this script to add a product to our Shopify store.
// This is a great way to test our API connection and to automate adding products in the future.

// Node's native fetch is used to make the API request.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// 1. Get the Shopify store domain and Admin API access token from the environment variables.
const { NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN } = process.env;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
  console.error('Missing required environment variables. Please check your .env.local file.');
  console.error(`SHOPIFY_STORE_DOMAIN found: ${!!SHOPIFY_STORE_DOMAIN}`);
  console.error(`SHOPIFY_ADMIN_API_TOKEN found: ${!!SHOPIFY_ADMIN_API_TOKEN}`);
  process.exit(1);
}


// 2. Define the product we want to create.
const newProduct = {
  product: {
    title: "Enchanted Forest Candle",
    body_html: "<strong>A delightful candle with notes of pine, cedar, and a hint of magic.</strong>",
    vendor: "Three Chicks and a Wick",
    product_type: "Scented Candle",
    tags: ["candle", "enchanted forest", "pine"],
    variants: [
      {
        option1: "8 oz",
        price: "24.99",
        sku: "TGAW-EFC-8"
      }
    ]
  }
};

// 3. Construct the Shopify Admin API URL.
const apiUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/products.json`;

// 4. Set up the request options for our fetch call.
const requestOptions = {
  method: 'POST',
  headers: {
    'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newProduct),
};

// 5. Make the request to the Shopify API and log the response.
console.log("Creating new product...");

try {
  const response = await fetch(apiUrl, requestOptions);
  const responseData = await response.json();

  if (response.ok) {
    console.log("Product created successfully!");
    console.log(JSON.stringify(responseData.product, null, 2));
  } else {
    console.error("Failed to create product:");
    console.error(responseData);
  }
} catch (error) {
  console.error("An error occurred while creating the product:", error);
} 