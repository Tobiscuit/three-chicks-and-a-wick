const { GoogleGenerativeAI } = require('@google/generative-ai');

// Handler for the Magic Request (existing functionality)
exports.magicRequestHandler = async (event) => {
  try {
    console.log('Full event:', JSON.stringify(event, null, 2));
    
    // AppSync passes JSON in event.arguments
    const args = event && event.arguments ? event.arguments : {};
    const prompt = args.prompt || null;
    const size = args.size || null;

    if (!prompt || !size) {
      throw new Error("Missing 'prompt' or 'size' in the request arguments.");
    }

    // Use Gemini to generate name and description as strict JSON
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const instruction = `Return ONLY valid minified JSON with keys candleName (string) and description (HTML string). No code fences, no extra text.
Constraints:
- candleName: concise, creative, no quotes inside
- description: brief HTML with <h2> for the name and a <p> paragraph that we can render directly.
Example: {"candleName":"Cozy Library Glow","description":"<h2>Cozy Library Glow</h2><p>...text...</p>"}`;

    const aiPrompt = `User prompt: "${prompt}". Size: "${size}". ${instruction}`;
    const result = await model.generateContent(aiPrompt);
    const text = (result && result.response && result.response.text()) || '';

    const extractJson = (raw) => {
      if (!raw) return null;
      // Strip code fences if present
      const cleaned = raw.replace(/```json|```/gi, '').trim();
      // Find the first '{' and last '}' to tolerate prefix/suffix noise
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) return null;
      return cleaned.slice(start, end + 1);
    };

    let jsonText = extractJson(text);
    let parsed;
    try {
      parsed = jsonText ? JSON.parse(jsonText) : null;
    } catch (_e) {
      parsed = null;
    }

    const fallbackName = `Your ${size.replace(/\(.*\)/, '').trim()} Magic Candle`;
    const safeName = (parsed && typeof parsed.candleName === 'string' && parsed.candleName.trim()) || fallbackName;
    const safeDesc = (parsed && typeof parsed.description === 'string' && parsed.description.trim())
      || `<h2>${safeName}</h2><p>A handcrafted creation inspired by: ${prompt}</p>`;

    return { candleName: safeName, description: safeDesc };

  } catch (error) {
    console.error("Error in Lambda handler:", error);
    return {
      candleName: 'Error',
      description: error.message || "An unknown error occurred",
    };
  }
};

// V2: Strict JSON response (no HTML parsing) for UI-safe rendering
exports.magicRequestV2Handler = async (event) => {
  try {
    const args = event && event.arguments ? event.arguments : {};
    const prompt = args.prompt || '';
    const size = args.size || '';
    const wick = args.wick || '';
    const jar = args.jar || '';

    const mode = (process.env.PREVIEW_MODE || 'static').toLowerCase();
    console.log('[magicRequestV2] mode=', mode, 'size=', size, 'wick=', wick, 'jar=', jar);

    if (mode === 'ai') {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const system = `You are a brand-aware UI content generator for Three Chicks and a Wick.
Return ONLY JSON (no code fences). Follow this schema exactly:
{
  "version": "1.0",
  "candle": { "name": string, "size": string },
  "preview": { "blocks": Array< { "type": "heading"|"paragraph"|"bulletList", "level"?: 1|2|3|4, "text"?: string, "items"?: string[] } > },
  "design": { "tokens": { "headingColor": string, "bodyColor": string, "accent": string }, "classes": { "container": string, "heading": string, "paragraph": string, "list": string } },
  "animation": { "entrance": "fadeInUp"|"fadeIn"|"slideUp", "durationMs": number }
}
Rules:
- Use tokens from our design system: playfulPink, creativeTeal, candlelightCream, charcoalTin.
- Use Nunito for headings and Poppins for body in classes.
- No HTML anywhere; only plain text and arrays.`;

      const user = `prompt: "${prompt}", size: "${size}", wick: "${wick}", jar: "${jar}"`;
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${system}\n\n${user}` }] }],
        generationConfig: { responseMimeType: 'application/json' },
      });
      const raw = (result && result.response && result.response.text()) || '';
      const cleaned = raw.replace(/```[\s\S]*?```/g, '').trim();
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        const jsonSlice = cleaned.slice(start, end + 1);
        try {
          const aiParsed = JSON.parse(jsonSlice);
          if (aiParsed && aiParsed.preview && Array.isArray(aiParsed.preview.blocks)) {
            aiParsed.meta = { mode: 'ai' };
            return { json: JSON.stringify(aiParsed) };
          }
        } catch (e) {
          throw new Error(`AI JSON parse error: ${e?.message || 'unknown'}`);
        }
      }
      throw new Error('AI output missing valid JSON payload');
    }

    // Static deterministic fallback
    const parsed = {
      version: '1.0',
      candle: { name: `Your ${size.replace(/\(.*\)/, '').trim()} Magic Candle`, size },
      preview: {
        blocks: [
          { type: 'heading', level: 2, text: `Your ${size.replace(/\(.*\)/, '').trim()} Magic Candle` },
          { type: 'paragraph', text: `Inspired by your idea with a ${wick} wick in a ${jar} jar: ${prompt}` }
        ]
      },
      design: {
        tokens: { headingColor: 'charcoalTin', bodyColor: 'charcoalTin', accent: 'playfulPink' },
        classes: { container: 'bg-cream rounded-xl p-6 border-subtle-border', heading: 'font-headings text-2xl', paragraph: 'font-body text-base', list: 'list-disc pl-5' }
      },
      animation: { entrance: 'fadeInUp', durationMs: 450 },
      meta: { mode: 'static' }
    };

    return { json: JSON.stringify(parsed) };
  } catch (error) {
    console.error('Error in magicRequestV2 handler:', error);
    const fallback = {
      version: '1.0',
      candle: { name: 'Your Magic Candle', size: '' },
      preview: { blocks: [ { type: 'heading', level: 2, text: 'Your Magic Candle' }, { type: 'paragraph', text: error.message || 'Something went wrong.' } ] },
      design: { tokens: { headingColor: 'charcoalTin', bodyColor: 'charcoalTin', accent: 'playfulPink' }, classes: { container: 'bg-cream rounded-xl p-6 border-subtle-border', heading: 'font-headings text-2xl', paragraph: 'font-body text-base', list: 'list-disc pl-5' } },
      animation: { entrance: 'fadeIn', durationMs: 300 },
    };
    return { json: JSON.stringify(fallback) };
  }
};
// --- NEW LOGIC FOR MULTI-PRODUCT VARIANT ARCHITECTURE ---

// Helper function to determine the Scent Tier
const getScentTier = (scentCount) => {
  if (scentCount <= 4) return 'Standard (0-4 Scents)';
  if (scentCount === 5) return 'Complex I (5 Scents)';
  if (scentCount === 6) return 'Complex II (6 Scents)';
  if (scentCount >= 7) return 'Complex III (7 Scents)';
  return 'Standard (0-4 Scents)';
};

// Minimal Shopify Storefront GraphQL helper
const shopifyStorefront = async (query, variables) => {
  const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await response.json();
  if (!response.ok || data.errors) {
    const message = data.errors ? data.errors.map(e => e.message).join('; ') : `HTTP ${response.status}`;
    throw new Error(`Shopify Storefront error: ${message}`);
  }
  return data;
};

// Main helper function to find the correct variant and add it to the cart
const findVariantAndAddToCart = async (cartId, { size, wick, jar, prompt }) => {
  // 1. Determine the product handle from the size
  let productHandle = '';
  if (size.includes('8oz')) productHandle = 'custom-candle-spark-8oz';
  else if (size.includes('12oz')) productHandle = 'custom-candle-flame-12oz';
  else if (size.includes('16oz')) productHandle = 'custom-candle-glow-16oz';

  if (!productHandle) {
    throw new Error(`Invalid size specified: ${size}`);
  }

  // 2. Call Gemini to get the recipe and determine the scent tier
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const chandlerPrompt = `You are a master chandler creating a recipe for a custom candle based on a user's prompt. The user's prompt is: "${prompt}". Create a detailed scent recipe. Aim for a sophisticated and well-balanced blend of 3 to 5 high-quality scent materials. Do not exceed 7 unique materials under any circumstances. Return ONLY a JSON object with two keys: "candleName" (a creative name for the candle) and "materials" (an array of unique scent material strings).`;
  
  const result = await model.generateContent(chandlerPrompt);
  const responseText = result.response.text().replace(/```json|```/g, '').trim();
  const recipe = JSON.parse(responseText);
  
  const scentTier = getScentTier(recipe.materials.length);
  const candleName = recipe.candleName || "Your Magical Creation";

  // 3. Find the matching variant in Shopify
  const getVariantQuery = `
    query getProductVariant($handle: String!, $options: [SelectedOptionInput!]!) {
      product(handle: $handle) {
        variantBySelectedOptions(selectedOptions: $options) {
          id
        }
      }
    }
  `;
  
  const selectedOptions = [
    { name: 'Wick', value: wick },
    { name: 'Jar', value: jar },
    { name: 'Scent Tier', value: scentTier },
  ];

  const variantData = await shopifyStorefront(getVariantQuery, { handle: productHandle, options: selectedOptions });
  const variantId = variantData.data.product?.variantBySelectedOptions?.id;

  if (!variantId) {
    throw new Error(`Could not find a matching variant for options: ${JSON.stringify(selectedOptions)}`);
  }

  // 4. Add the found variant to the cart (or create a new cart)
  const attributes = [
    { key: "Candle Name", value: candleName },
    { key: "Original Prompt", value: prompt.substring(0, 100) }, // Truncate for safety
  ];
  
  let cart;
  if (cartId) {
    // Add to existing cart
    const addToCartMutation = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { id totalQuantity cost { totalAmount { amount currencyCode } } lines(first: 50) { edges { node { id quantity attributes { key value } merchandise { ... on ProductVariant { id title price { amount currencyCode } } } } } } }
        }
      }`;
    const cartData = await shopifyStorefront(addToCartMutation, { cartId, lines: [{ merchandiseId: variantId, quantity: 1, attributes }] });
    const userErrors = cartData?.data?.cartLinesAdd?.userErrors || [];
    if (userErrors.length > 0) {
      throw new Error(`Shopify cartLinesAdd error: ${userErrors.map(e => e.message).join('; ')}`);
    }
    cart = cartData?.data?.cartLinesAdd?.cart;
    if (!cart) {
      throw new Error('Shopify cartLinesAdd returned no cart');
    }
  } else {
    // Create a new cart
    const createCartMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart { id totalQuantity cost { totalAmount { amount currencyCode } } lines(first: 50) { edges { node { id quantity attributes { key value } merchandise { ... on ProductVariant { id title price { amount currencyCode } } } } } } }
        }
      }`;
    const cartData = await shopifyStorefront(createCartMutation, { input: { lines: [{ merchandiseId: variantId, quantity: 1, attributes }] } });
    const userErrors = cartData?.data?.cartCreate?.userErrors || [];
    if (userErrors.length > 0) {
      throw new Error(`Shopify cartCreate error: ${userErrors.map(e => e.message).join('; ')}`);
    }
    cart = cartData?.data?.cartCreate?.cart;
    if (!cart) {
      throw new Error('Shopify cartCreate returned no cart');
    }
  }
  
  // 5. Normalize and return the cart data
  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    cost: { totalAmount: cart.cost.totalAmount },
    lines: cart.lines.edges.map(edge => ({
      id: edge.node.id,
      quantity: edge.node.quantity,
      attributes: edge.node.attributes,
      merchandise: {
        id: edge.node.merchandise.id,
        title: edge.node.merchandise.title,
        price: edge.node.merchandise.price
      }
    }))
  };
};

exports.addToCartHandler = async (event) => {
  try {
    return await findVariantAndAddToCart(event.arguments.cartId, event.arguments);
  } catch (error) {
    console.error("Error in addToCart handler:", error);
    // Throw to surface as GraphQL error; return type is Cart and cannot accept an error object
    throw new Error(error.message || 'AddToCartError');
  }
};

exports.createCartWithCustomItemHandler = async (event) => {
  try {
    return await findVariantAndAddToCart(null, event.arguments);
  } catch (error) {
    console.error("Error in createCartWithCustomItem handler:", error);
    // Throw to surface as GraphQL error; return type is Cart and cannot accept an error object
    throw new Error(error.message || 'CreateCartError');
  }
};

// Helper for draft order line items used by createCheckout
const createShopifyLineItem = (item) => {
  if (item.type === 'STANDARD') {
    return {
      variant_id: item.variantId,
      quantity: item.quantity,
    };
  }

    const basePrice = 42.0; 
  const materialCount = item?.configuration?.scentRecipe?.materialCount ?? 0;
  const scentUpcharge = Math.max(0, materialCount - 3) * 2;
    const finalPrice = basePrice + scentUpcharge;

    return {
      title: `Your Custom 'Cozy Library' Candle`,
      price: finalPrice.toFixed(2),
      quantity: 1,
      custom_attributes: [
      { key: 'Size', value: item?.configuration?.size ?? '' },
      { key: 'Jar', value: item?.configuration?.jarType ?? '' },
      { key: 'Scent', value: (item?.configuration?.scentRecipe?.materials ?? []).join(', ') },
    ],
  };
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
