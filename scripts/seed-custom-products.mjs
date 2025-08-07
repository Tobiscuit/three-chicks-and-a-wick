// scripts/seed-custom-products.mjs
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

// --- Configuration ---
// Here you can define the product options and their pricing.
const products = [
  {
    title: "Custom Candle - The Spark (8oz)",
    handle: "custom-candle-spark-8oz",
    basePrice: 28.00,
  },
  {
    title: "Custom Candle - The Flame (12oz)",
    handle: "custom-candle-flame-12oz",
    basePrice: 38.00,
  },
  {
    title: "Custom Candle - The Glow (16oz)",
    handle: "custom-candle-glow-16oz",
    basePrice: 48.00,
  },
];

const options = {
  Wick: [
    { value: 'Cotton', priceModifier: 0 },
    { value: 'Hemp', priceModifier: 0 },
    { value: 'Wood', priceModifier: 2.00 },
  ],
  Jar: [
    { value: 'Standard Tin', priceModifier: 0 },
    { value: 'Amber Glass', priceModifier: 4.00 },
    { value: 'Frosted Glass', priceModifier: 4.00 },
    { value: 'Ceramic', priceModifier: 8.00 },
  ],
  'Scent Tier': [
    { value: 'Standard (0-4 Scents)', priceModifier: 0 },
    { value: 'Complex I (5 Scents)', priceModifier: 2.00 },
    { value: 'Complex II (6 Scents)', priceModifier: 4.00 },
    { value: 'Complex III (7 Scents)', priceModifier: 6.00 },
  ],
};

const { NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN } = process.env;
const API_VERSION = '2024-07';
const shopifyAdminUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products.json`;
const shopifyVariantUrl = (productId) => `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/products/${productId}/variants.json`;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
  console.error("Missing Shopify environment variables. Please create a .env.local file with SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_API_TOKEN.");
  process.exit(1);
}

// --- Main Script ---
async function createProducts() {
  console.log("Starting custom product seeding script...");

  for (const productDef of products) {
    console.log(`\n--- Processing Product: ${productDef.title} ---`);

    // 1. Generate all variants for the product first
    console.log("Generating variants...");
    const variants = [];
    for (const wick of options.Wick) {
      for (const jar of options.Jar) {
        for (const scentTier of options['Scent Tier']) {
          const finalPrice = productDef.basePrice + wick.priceModifier + jar.priceModifier + scentTier.priceModifier;
          variants.push({
            option1: wick.value,
            option2: jar.value,
            option3: scentTier.value,
            price: finalPrice.toFixed(2),
          });
        }
      }
    }
    console.log(`Generated ${variants.length} variants.`);

    // 2. Create the product and all its variants in one API call
    const productPayload = {
      product: {
        title: productDef.title,
        handle: productDef.handle,
        vendor: "Three Chicks & a Wick",
        product_type: "Custom Candle",
        status: "active",
        options: Object.keys(options).map(name => ({ name })),
        variants: variants,
      },
    };

    try {
      console.log("Sending data to Shopify...");
      const response = await fetch(shopifyAdminUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
        },
        body: JSON.stringify(productPayload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw newError(`Failed to create product: ${JSON.stringify(data.errors)}`);
      }
      console.log(`✅ Product and all ${variants.length} variants created successfully! (ID: ${data.product.id})`);
    } catch (error) {
      console.error(`❌ ${error.message}`);
      console.log("This might be because the product already exists.");
    }
  }
  console.log("\n🚀 Script finished!");
}

createProducts();

