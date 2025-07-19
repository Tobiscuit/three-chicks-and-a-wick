// scripts/delete-all-products.mjs

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN } = process.env;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
  console.error('Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

const getProductsUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/products.json`;
const deleteProductUrl = (id) => `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/products/${id}.json`;

const apiHeaders = {
  'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
  'Content-Type': 'application/json',
};

async function deleteAllProducts() {
  console.log("Fetching all products to delete...");
  
  try {
    // 1. Get all products
    const getResponse = await fetch(getProductsUrl, { headers: apiHeaders });
    const { products } = await getResponse.json();

    if (!products || products.length === 0) {
      console.log("No products found to delete.");
      return;
    }

    console.log(`Found ${products.length} products. Starting deletion...`);

    // 2. Loop through and delete each product
    for (const product of products) {
      console.log(`Deleting product: ${product.title} (ID: ${product.id})`);
      const deleteResponse = await fetch(deleteProductUrl(product.id), {
        method: 'DELETE',
        headers: apiHeaders,
      });

      if (deleteResponse.ok) {
        console.log(` -> Successfully deleted.`);
      } else {
        const errorData = await deleteResponse.json();
        console.error(` -> Failed to delete. Status: ${deleteResponse.status}`, errorData);
      }
      // Add a small delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("\nAll products have been deleted.");
  } catch (error) {
    console.error("An error occurred during the deletion process:", error);
  }
}

deleteAllProducts(); 