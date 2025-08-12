const { GoogleGenAI } = require('@google/genai');

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
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelId = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const modelIdFast = process.env.GEMINI_MODEL || process.env.GEMINI_MODEL_FAST || 'gemini-2.5-flash';
    console.log('[magicRequest] calling genai', { modelId, mode: 'sync-legacy' });

    const instruction = `Return ONLY valid minified JSON with keys candleName (string) and description (HTML string). No code fences, no extra text.
Constraints:
- candleName: concise, creative, no quotes inside
- description: brief HTML with <h2> for the name and a <p> paragraph that we can render directly.
Example: {"candleName":"Cozy Library Glow","description":"<h2>Cozy Library Glow</h2><p>...text...</p>"}`;

    const aiPrompt = `User prompt: "${prompt}". Size: "${size}". ${instruction}`;
    const result = await genAI.models.generateContent({ model: modelId, contents: aiPrompt });
    const text = (result && result.text) ? result.text : (result && result.response && result.response.text()) || '';

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
    console.log('[magicRequestV2] version','2025-08-11T-deploy-2');
    if (event && event.action === 'start') {
      return await exports.startMagicPreviewHandler(event);
    }
    if (event && event.action === 'get') {
      return await exports.getMagicPreviewJobHandler(event);
    }
    if (event && event.action === 'share') {
      return await exports.shareCandleHandler(event);
    }
    if (event && event.action === 'community') {
      return await exports.getCommunityCreationsHandler(event);
    }
    const args = event && event.arguments ? event.arguments : {};
    const prompt = args.prompt || '';
    const size = args.size || '';
    const wick = args.wick || '';
    const jar = args.jar || '';
    const wax = args.wax || '';

    console.log('[magicRequestV2] sync path. size=', size, 'wick=', wick, 'jar=', jar, 'wax=', wax);

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelId = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const system = `You are a world-class UI/UX designer and copywriter for the premium candle brand 'Three Chicks and a Wick.'\nYour goal is to produce a complete, mobile-first reveal experience for a customer's custom candle.`;
    const textPrompt = `${system}\n\nReturn ONLY a strict, minified JSON object with a single key \"htmlBase64\" whose value is the base64-encoded UTF-8 HTML snippet. Do not include markdown or code fences.\nHTML requirements:\n- Wrap in <div id=\"candle-preview\"> ... </div>\n- One inline <style> with CSS scoped to #candle-preview\n- Fonts: Nunito (headings), Poppins (body)\n- Colors: accent #F25287, cream #FEF9E7, good contrast\n- Content: evocative candle name (2–4 words), two short paragraphs totaling 90–150 words, and a 3–5 item bullet list\n- US English and original\n\nUser input (use to guide tone only): prompt=${prompt}; size=${size}; wick=${wick}; jar=${jar}; wax=${wax}`;
    // No internal timeouts; await the model call directly to capture actual failure modes

    // Diagnostic mode: if DIAGNOSTIC_HELLO is set, send a trivial prompt to validate key/connectivity
    if (process.env.DIAGNOSTIC_HELLO === '1') {
      const diagStart = Date.now();
      console.log('[magicRequestV2][diag] BEGIN hello-world test', { modelId });
      try {
        const diagRes = await genAI.models.generateContent({ model: modelId, contents: 'Hello World' });
        const diagText = (diagRes && diagRes.text) ? diagRes.text : (diagRes && diagRes.response && diagRes.response.text()) || '';
        console.log('[magicRequestV2][diag] OK', { ms: Date.now() - diagStart, sample: (diagText || '').slice(0, 80) });
        const ok = { version: '1.0', candle: { name: 'Diag OK', size }, html: `<div id="candle-preview"><style>#candle-preview{font-family:Poppins;background:#FEF9E7;padding:16px;border:1px solid #eee;border-radius:12px}</style><h2>Diagnostic OK</h2><p>Gemini call succeeded in ${Date.now() - diagStart}ms.</p></div>`, rawText: diagText, meta: { mode: 'diag-ok', modelId } };
        return { json: JSON.stringify(ok) };
      } catch (e) {
        console.error('[magicRequestV2][diag] FAIL', { ms: Date.now() - diagStart, message: e?.message, stack: e?.stack });
        const fail = { version: '1.0', candle: { name: 'Diag FAIL', size }, html: `<div id="candle-preview"><style>#candle-preview{font-family:Poppins;background:#FEF9E7;padding:16px;border:1px solid #eee;border-radius:12px}</style><h2>Diagnostic Failed</h2><p>${String(e?.message || 'Unknown error').replace(/</g,'&lt;')}</p></div>`, rawText: '', meta: { mode: 'diag-fail', modelId, error: e?.message } };
        return { json: JSON.stringify(fail) };
      }
    }

    const tryGenerate = async () => {
      const startMs = Date.now();
      console.log('[magicRequestV2] calling genai', { modelId, mode: 'sync-json' });
      const result = await genAI.models.generateContent({
        model: modelId,
        contents: [
          { role: 'user', parts: [{ text: textPrompt }] }
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              htmlBase64: { type: 'string' },
              candle: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  size: { type: 'string' }
                }
              },
              meta: { type: 'object' }
            },
            required: ['htmlBase64']
          }
        }
      });
      console.log('[magicRequestV2] genai returned', { ms: Date.now() - startMs });
      const raw = (result && result.response && typeof result.response.text === 'function') ? result.response.text() : (result && result.text) || '';
      let aiParsed;
      try {
        aiParsed = raw ? JSON.parse(raw) : null;
      } catch (e) {
        throw new Error(`AI JSON parse error: ${e?.message || 'unknown'}`);
      }
      if (aiParsed && typeof aiParsed.htmlBase64 === 'string' && aiParsed.htmlBase64.trim()) {
        try {
          const htmlDecoded = Buffer.from(aiParsed.htmlBase64, 'base64').toString('utf8');
          aiParsed.html = htmlDecoded;
        } catch (_d) {}
        delete aiParsed.htmlBase64;
      }
      if (aiParsed && typeof aiParsed.html === 'string') {
        let html = aiParsed.html;
        html = html.replace(/```[\s\S]*?```/g, '');
        html = html.replace(/<script[\s\S]*?>[\s\S]*?<\\/script>/gi, '');
        html = html.replace(/ on\w+=\"[^\"]*\"/gi, '').replace(/ on\w+='[^']*'/gi, '');
        html = html.replace(/@import[^;]+;?/gi, '');
        html = html.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
        aiParsed.html = html.trim();
      }
      aiParsed = aiParsed || {};
      aiParsed.meta = { ...(aiParsed.meta || {}), mode: 'ai' };
      if (aiParsed.candle && typeof aiParsed.candle.name === 'string') {
        aiParsed.candle.name = aiParsed.candle.name
          .replace(/\s+/g, ' ')
          .replace(/[^a-zA-Z0-9'\-\s]/g, '')
          .trim();
      }
      return aiParsed;
    };

    // Single fast attempt to stay within AppSync 30s limit
    const parsed = await tryGenerate();
    return { json: JSON.stringify(parsed) };
  } catch (error) {
    console.error('Error in magicRequestV2 handler:', {
      message: error?.message,
      stack: error?.stack,
    });
    const safePrompt = (event?.arguments?.prompt || '').toString();
    const size = (event?.arguments?.size || '').toString();
    const wick = (event?.arguments?.wick || '').toString();
    const jar = (event?.arguments?.jar || '').toString();
    const fallbackHtml = `
      <div id="candle-preview">
        <style>
          #candle-preview{font-family:Poppins,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#FEF9E7;color:#222;border-radius:12px;padding:20px;border:1px solid #eee}
          #candle-preview h2{font-family:Nunito,sans-serif;margin:0 0 8px 0;font-size:22px;color:#111}
          #candle-preview p{margin:8px 0 0 0;line-height:1.5}
          #candle-preview ul{margin:8px 0 0 18px}
          #candle-preview .accent{color:#F25287}
          #candle-preview .meta{opacity:.8;font-size:12px;margin-top:10px}
        </style>
        <h2 class="accent">Your Magic Candle</h2>
        <p>A handcrafted reveal based on: <strong>${safePrompt.replace(/</g,'&lt;').slice(0,140)}</strong>.</p>
        <p>This is a fast fallback preview so your demo is unblocked while the AI service is unavailable.</p>
        <ul>
          <li>Size: ${size.replace(/</g,'&lt;')}</li>
          <li>Wick: ${wick.replace(/</g,'&lt;')}</li>
          <li>Jar: ${jar.replace(/</g,'&lt;')}</li>
        </ul>
        <div class="meta">Note: Fast preview mode.</div>
      </div>`;
    const fallback = { version: '1.0', candle: { name: 'Your Magic Candle', size }, html: fallbackHtml, meta: { mode: 'fallback' } };
    return { json: JSON.stringify(fallback) };
  }
};
// Async preview: start job -> enqueue -> return jobId
exports.startMagicPreviewHandler = async (event) => {
  const args = event.arguments || {};
  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const sqs = new AWS.SQS();
  const table = process.env.PREVIEW_JOBS_TABLE;
  const queueUrl = process.env.PREVIEW_JOBS_QUEUE_URL;
  try {
    if (!table || !queueUrl) throw new Error('Preview job resources missing');
    await dynamodb.put({ TableName: table, Item: { jobId, status: 'QUEUED', args } }).promise();
    await sqs.sendMessage({ QueueUrl: queueUrl, MessageBody: JSON.stringify({ jobId }) }).promise();
    return { jobId, status: 'QUEUED' };
  } catch (e) {
    return { jobId, status: 'ERROR', error: e.message || 'Unknown error' };
  }
};

// Async preview: get job status
exports.getMagicPreviewJobHandler = async (event) => {
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const table = process.env.PREVIEW_JOBS_TABLE;
  const jobId = event.arguments.jobId;
  const res = await dynamodb.get({ TableName: table, Key: { jobId } }).promise();
  const item = res.Item || { jobId, status: 'ERROR', error: 'NotFound' };
  return item;
};

// Mark a candle as shared
exports.shareCandleHandler = async (event) => {
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const table = process.env.PREVIEW_JOBS_TABLE;
  const jobId = event?.arguments?.jobId;
  if (!table || !jobId) return { ok: false };
  await dynamodb.update({
    TableName: table,
    Key: { jobId },
    UpdateExpression: 'SET isShared = :t',
    ExpressionAttributeValues: { ':t': true }
  }).promise();
  return { ok: true };
};

// List shared candles (basic scan; optimize later with GSI)
exports.getCommunityCreationsHandler = async (event) => {
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const table = process.env.PREVIEW_JOBS_TABLE;
  const limit = Math.max(1, Math.min(50, Number(event?.arguments?.limit) || 20));
  const res = await dynamodb.scan({ TableName: table, FilterExpression: 'isShared = :t', ExpressionAttributeValues: { ':t': true }, Limit: limit }).promise();
  const items = (res.Items || []).map(it => ({ jobId: it.jobId, candleName: it?.candle?.name, html: it.html, createdAt: it.createdAt }));
  return { items, nextToken: res.LastEvaluatedKey ? JSON.stringify(res.LastEvaluatedKey) : null };
};

// SQS worker (same bundle)
exports.previewWorkerHandler = async (event) => {
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const table = process.env.PREVIEW_JOBS_TABLE;
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelId = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

  for (const record of event.Records) {
    const { jobId } = JSON.parse(record.body);
    const job = await dynamodb.get({ TableName: table, Key: { jobId } }).promise();
    const args = job.Item.args;
    await dynamodb.update({ TableName: table, Key: { jobId }, UpdateExpression: 'SET #s = :p', ExpressionAttributeNames: { '#s': 'status' }, ExpressionAttributeValues: { ':p': 'PROCESSING' } }).promise();
    try {
    const system = `Return ONLY a strict minified JSON object with a single key htmlBase64 whose value is the base64-encoded UTF-8 HTML snippet. The HTML must be wrapped in <div id=\"candle-preview\"> ... </div> and include one inline <style> scoped to #candle-preview. Use brand accent #F25287 and cream #FEF9E7; US English; two paragraphs total 90–150 words; and a 3–5 item bullet list.`;
    const user = JSON.stringify({ system_prompt: system, user_input: { prompt: args.prompt, size: args.size, wick: args.wick, jar: args.jar, wax: args.wax } });
      const withTimeout = async (promise, ms, label) => {
        let timer;
        const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label || 'GenAI'} timeout after ${ms}ms`)), ms); });
        try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
      };
      console.log('[previewWorker] calling genai', { modelId, responseMimeType: 'omitted', mode: 'worker' });
      const result = await withTimeout(
        genAI.models.generateContent({ model: modelId, contents: user, generationConfig: { temperature: 0.3, responseMimeType: 'application/json' } }),
        20000,
        'GenAI'
      );
      const raw = (result && result.text) ? result.text : (result && result.response && result.response.text()) || '';
      let cleaned = raw.replace(/```[\s\S]*?```/g, '').replace(/[\u2028\u2029]/g, ' ').trim();
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      let html = cleaned;
      if (start !== -1 && end !== -1 && end > start) {
        try {
          const parsed = JSON.parse(cleaned.slice(start, end + 1));
          if (typeof parsed.htmlBase64 === 'string' && parsed.htmlBase64.trim()) {
            html = Buffer.from(parsed.htmlBase64, 'base64').toString('utf8');
          }
        } catch (_e) {}
      }
      html = html
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[\u2028\u2029]/g, ' ')
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/ on\w+="[^"]*"/gi, '')
        .replace(/ on\w+='[^']*'/gi, '')
        .trim();
      await dynamodb.update({ TableName: table, Key: { jobId }, UpdateExpression: 'SET #s = :r, html = :h', ExpressionAttributeNames: { '#s': 'status' }, ExpressionAttributeValues: { ':r': 'READY', ':h': html } }).promise();
    } catch (e) {
      await dynamodb.update({ TableName: table, Key: { jobId }, UpdateExpression: 'SET #s = :e, error = :m', ExpressionAttributeNames: { '#s': 'status' }, ExpressionAttributeValues: { ':e': 'ERROR', ':m': e.message || 'unknown' } }).promise();
    }
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
    const genAI2 = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelId2 = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
    console.log('[addToCart] calling genai', { modelId: modelId2, mode: 'recipe' });
  
  const chandlerPrompt = `You are a master chandler creating a recipe for a custom candle based on a user's prompt. The user's prompt is: "${prompt}". Create a detailed scent recipe. Aim for a sophisticated and well-balanced blend of 3 to 5 high-quality scent materials. Do not exceed 7 unique materials under any circumstances. Return ONLY a JSON object with two keys: "candleName" (a creative name for the candle) and "materials" (an array of unique scent material strings).`;
  
  const result = await genAI2.models.generateContent({ model: modelId2, contents: chandlerPrompt });
  const responseText = ((result && result.text) ? result.text : (result && result.response && result.response.text()) || '').replace(/```json|```/g, '').trim();
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
