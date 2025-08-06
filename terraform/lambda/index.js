const { GoogleGenerativeAI } = require('@google/generative-ai');

// Handler for the Magic Request (existing functionality)
exports.magicRequestHandler = async (event) => {
  try {
    console.log('Full event:', JSON.stringify(event, null, 2));
    
    const argsString = event.arguments;
    const promptMatch = argsString.match(/prompt=([^,]+)/);
    const sizeMatch = argsString.match(/size=([^}]+)/);
    
    const prompt = promptMatch ? promptMatch[1] : null;
    const size = sizeMatch ? sizeMatch[1] : null;

    if (!prompt || !size) {
      throw new Error("Missing 'prompt' or 'size' in the request arguments.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const customerPrompt = `You are a scent poet...`; // (existing prompt)
    const customerResult = await model.generateContent(customerPrompt);
    const customerDescription = customerResult.response.text();

    const nameMatch = customerDescription.match(/<h2[^>]*>([^<]+)<\/h2>/);
    const candleName = nameMatch ? nameMatch[1] : "Your Custom Candle";

    const clientPrompt = `You are a master chandler...`; // (existing prompt)
    const clientResult = await model.generateContent(clientPrompt);
    const recipeJsonString = clientResult.response.text().replace(/```json|```/g, '').trim();
    const recipe = JSON.parse(recipeJsonString);
    
    const draftOrderPayload = { /* ... existing payload ... */ };

    const shopifyApiUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/draft_orders.json`;
    await fetch(shopifyApiUrl, { /* ... existing fetch options ... */ });
    
    return {
      candleName: candleName,
      description: customerDescription,
    };

  } catch (error) {
    console.error("Error in Lambda handler:", error);
    return {
      candleName: 'Error',
      description: error.message || "An unknown error occurred",
    };
  }
};

// --- NEW HANDLER FOR CREATE CHECKOUT ---

const createShopifyLineItem = (item) => {
  if (item.type === 'STANDARD') {
    return {
      variant_id: item.variantId,
      quantity: item.quantity,
    };
  } else {
    const basePrice = 42.0; 
    const scentUpcharge = Math.max(0, item.configuration.scentRecipe.materialCount - 3) * 2;
    const finalPrice = basePrice + scentUpcharge;

    return {
      title: `Your Custom 'Cozy Library' Candle`,
      price: finalPrice.toFixed(2),
      quantity: 1,
      custom_attributes: [
        { key: "Size", value: item.configuration.size },
        { key: "Jar", value: item.configuration.jarType },
        { key: "Scent", value: item.configuration.scentRecipe.materials.join(', ') }
      ]
    };
  }
};

exports.createCheckoutHandler = async (event) => {
  try {
    const items = event.arguments.items;

    if (!items || items.length === 0) {
      throw new Error('Cart is empty');
    }

    const lineItems = items.map(createShopifyLineItem);

    const draftOrderPayload = {
      draft_order: {
        line_items: lineItems,
      },
    };

    const shopifyEndpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/draft_orders.json`;
    
    const shopifyResponse = await fetch(shopifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify(draftOrderPayload),
    });

    if (!shopifyResponse.ok) {
      const errorBody = await shopifyResponse.text();
      console.error('Shopify API Error:', errorBody);
      throw new Error(`Shopify API responded with status ${shopifyResponse.status}`);
    }

    const responseData = await shopifyResponse.json();
    const invoiceUrl = responseData.draft_order?.invoice_url;

    if (!invoiceUrl) {
      throw new Error('Failed to retrieve checkout URL from Shopify.');
    }

    return {
      invoice_url: invoiceUrl,
    };

  } catch (error) {
    console.error("Error in createCheckout handler:", error);
    return {
      error: {
        message: error.message || "An unknown error occurred",
        type: "CheckoutError",
      },
    };
  }
};
