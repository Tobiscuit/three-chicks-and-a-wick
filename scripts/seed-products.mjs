// scripts/seed-products.mjs

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN } = process.env;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
  console.error('Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

const imageUrls = {
  "Lavender Bliss Candle": "https://cdn.shopify.com/s/files/1/0712/2521/3117/files/lavender-bliss-candle.png?v=1752888573",
  "Ocean Breeze Candle": "https://cdn.shopify.com/s/files/1/0712/2521/3117/files/ocean-breeze-candle.png?v=1752888571",
  "DIY Macrame Plant Hanger Kit": "https://cdn.shopify.com/s/files/1/0712/2521/3117/files/diy-macrame-plant-hanger-kit.png?v=1752888572",
  "Vanilla Bean Dream Candle": "https://cdn.shopify.com/s/files/1/0712/2521/3117/files/vanilla-bean-dream-candle.png?v=1752888572",
  "Citrus Grove Soap Bar": "https://cdn.shopify.com/s/files/1/0712/2521/3117/files/citrus-grove-soap-bar.png?v=1752888572",
  "Enchanted Forest Wax Melts": "https://cdn.shopify.com/s/files/1/0712/2521/3117/files/enchanted-forest-wax-melts.png?v=1752888572",
};

const mockProducts = [
  {
    title: "Lavender Bliss Candle",
    body_html: "<strong>Calm your senses with the soothing scent of lavender.</strong> Hand-poured with natural soy wax.",
    vendor: "Three Chicks and a Wick",
    product_type: "Scented Candle",
    tags: ["candle", "lavender", "calming", "relaxation"],
    variants: [{ option1: "8 oz", price: "24.99", sku: "TGAW-LBC-8" }],
    images: [{ src: imageUrls["Lavender Bliss Candle"] }]
  },
  {
    title: "Ocean Breeze Candle",
    body_html: "<strong>Bring the fresh scent of the ocean into your home.</strong> Notes of sea salt, jasmine, and wood.",
    vendor: "Three Chicks and a Wick",
    product_type: "Scented Candle",
    tags: ["candle", "ocean", "fresh", "beachy"],
    variants: [{ option1: "8 oz", price: "24.99", sku: "TGAW-OBC-8" }],
    images: [{ src: imageUrls["Ocean Breeze Candle"] }]
  },
  {
    title: "DIY Macrame Plant Hanger Kit",
    body_html: "<strong>Unleash your inner artist!</strong> This kit includes everything you need to create a beautiful macrame plant hanger.",
    vendor: "Three Chicks and a Wick",
    product_type: "DIY Kit",
    tags: ["diy", "macrame", "craft kit", "plants"],
    variants: [{ option1: "Default", price: "35.00", sku: "TGAW-MPHK-1" }],
    images: [{ src: imageUrls["DIY Macrame Plant Hanger Kit"] }]
  },
  {
    title: "Vanilla Bean Dream Candle",
    body_html: "A classic, warm and inviting vanilla scent. Perfect for creating a cozy atmosphere.",
    vendor: "Three Chicks and a Wick",
    product_type: "Scented Candle",
    tags: ["candle", "vanilla", "cozy", "sweet"],
    variants: [{ option1: "8 oz", price: "22.99", sku: "TGAW-VBDC-8" }],
    images: [{ src: imageUrls["Vanilla Bean Dream Candle"] }]
  },
  {
    title: "Citrus Grove Soap Bar",
    body_html: "An uplifting and energizing soap bar with notes of lemon, orange, and grapefruit.",
    vendor: "Three Chicks and a Wick",
    product_type: "Handmade Soap",
    tags: ["soap", "citrus", "handmade", "energizing"],
    variants: [{ option1: "4 oz", price: "12.00", sku: "TGAW-CGSB-4" }],
    images: [{ src: imageUrls["Citrus Grove Soap Bar"] }]
  },
  {
    title: "Enchanted Forest Wax Melts",
    body_html: "Notes of pine, cedar, and a hint of magic, now in a wax melt format!",
    vendor: "Three Chicks and a Wick",
    product_type: "Wax Melt",
    tags: ["wax melt", "enchanted forest", "pine", "magic"],
    variants: [{ option1: "2.5 oz", price: "10.00", sku: "TGAW-EFWM-2.5" }],
    images: [{ src: imageUrls["Enchanted Forest Wax Melts"] }]
  },
];


const apiUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/products.json`;

async function createProduct(productData) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product: productData }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    const responseData = await response.json();

    if (response.ok) {
      console.log(`Successfully created product: ${productData.title}`);
      return responseData.product;
    } else {
      console.error(`Failed to create product: ${productData.title}`);
      console.error('Error:', responseData.errors || responseData);
      return null;
    }
  } catch (error) {
    console.error(`An error occurred while creating product: ${productData.title}`, error);
    return null;
  }
}

async function seedProducts() {
  console.log("Starting product seeding...");
  const createdProducts = [];

  for (const product of mockProducts) {
    const createdProduct = await createProduct(product);
    if (createdProduct) {
      createdProducts.push(createdProduct);
    }
    // Add a small delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\nProduct seeding complete!");
  console.log(`${createdProducts.length} of ${mockProducts.length} products were created.`);
}

seedProducts(); 