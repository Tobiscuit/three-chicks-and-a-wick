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
        html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
        html = html.replace(/ on\w+="[^"]*"/gi, '').replace(/ on\w+='[^']*'/gi, '');
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
    const now = Date.now();
    const ttlDays = 60;
    const ttl = Math.floor(now / 1000) + ttlDays * 24 * 60 * 60;
    await dynamodb.put({
      TableName: table,
      Item: {
        jobId,
        entityType: 'CANDLE_JOB',
        status: 'QUEUED',
        args,
        isShared: false,
        createdAt: now,
        updatedAt: now,
        ttl,
      }
    }).promise();
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
  const item = res.Item || { jobId, status: 'ERROR', jobError: 'NotFound' };
  // Whitelist only public fields to avoid leaking internal data
  const publicItem = {
    jobId: item.jobId,
    status: item.status,
    html: item.html,
    aiJson: item.aiJson,
    jobError: item.jobError,
    errorMessage: item.errorMessage,
    cartId: item.cartId,
    variantId: item.variantId,
    isShared: item.isShared,
  };
  return publicItem;
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
  const res = await dynamodb.scan({ TableName: table, FilterExpression: 'isShared = :t and attribute_not_exists(purchased) or purchased = :p', ExpressionAttributeValues: { ':t': true, ':p': true }, Limit: limit }).promise();
  const items = (res.Items || []).map(it => ({ jobId: it.jobId, candleName: it?.candle?.name, html: it.html, createdAt: it.createdAt }));
  return { items, nextToken: res.LastEvaluatedKey ? JSON.stringify(res.LastEvaluatedKey) : null };
};

// --- Shopify orders/create webhook saver ---
exports.webhookSaverHandler = async (event) => {
  const crypto = require('crypto');
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const table = process.env.DYNAMODB_TABLE;
  // Fetch secret from AWS Secrets Manager at runtime (name passed via env)
  const sm = new AWS.SecretsManager();
  const secretName = process.env.SHOPIFY_WEBHOOK_SECRET_NAME || '';
  const secretValue = secretName ? (await sm.getSecretValue({ SecretId: secretName }).promise()).SecretString : '';
  const secret = secretValue || '';
  try {
    if (!secret) return { statusCode: 500, body: 'Missing webhook secret' };
    const hmacHeader = event.headers['x-shopify-hmac-sha256'] || event.headers['X-Shopify-Hmac-Sha256'];
    const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body || '', 'utf8');
    const digest = crypto.createHmac('sha256', secret).update(body).digest('base64');
    if (!hmacHeader || !crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader))) {
      return { statusCode: 401, body: 'Invalid HMAC' };
    }
    const order = JSON.parse(body.toString('utf8'));
    const createdAt = Date.now();
    // Extract our custom line with hidden recipe attributes
    const lines = order?.line_items || [];
    for (const line of lines) {
      const props = line?.properties || [];
      const byKey = Object.fromEntries(props.map(p => [p.name || p.key, p.value]));
      if (byKey['_recipe_wax'] || byKey['_recipe_fragrance']) {
        const jobId = byKey['_creation_job_id'] || `order_${order.id}_${line.id}`;
        const item = {
          id: jobId,
          orderId: String(order.id),
          purchased: true,
          candle: { name: byKey['Candle Name'] || line?.title },
          recipe: {
            wax: byKey['_recipe_wax'] || '',
            fragrance: byKey['_recipe_fragrance'] || '',
            instructions: byKey['_recipe_instructions'] || '',
            size: byKey['_recipe_size'] || '',
          },
          createdAt,
        };
        await dynamodb.put({ TableName: table, Item: item }).promise();
      }
    }
    return { statusCode: 200, body: 'ok' };
  } catch (e) {
    return { statusCode: 500, body: String(e?.message || 'error') };
  }
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
    await dynamodb.update({ TableName: table, Key: { jobId }, UpdateExpression: 'SET #s = :p, updatedAt = :u', ExpressionAttributeNames: { '#s': 'status' }, ExpressionAttributeValues: { ':p': 'PROCESSING', ':u': Date.now() } }).promise();
    try {
      const system = `You are both a master candle poet and a master chandler for the premium brand 'Three Chicks and a Wick.' Interpret the user's idea and produce: (1) a brief, evocative description, and (2) a precise, quantitative recipe a professional chandler can follow.\n\nRecipe rules:\n- Use a 9% fragrance load\n- Wax weight by size: 8oz Tin = 6.5 oz (184g); 12oz Jar = 8.5 oz (241g); 16oz Jar = 12 oz (340g)\n- Fragrance oil weight = wax weight * 0.09 (report oz and grams)\n- Pour temps: Soy & Coconut Soy 180°F (82°C); Beeswax 160°F (71°C)\n- Provide 1–2 concise professional instruction sentences.\n\nIMPORTANT: Respond with ONLY a single raw JSON object. No markdown, no code fences, no extra text.`;
      const textPrompt = `${system}\n\nUser input: prompt=${args.prompt}; size=${args.size}; wick=${args.wick}; jar=${args.jar}; wax=${args.wax}`;
      const withTimeout = async (promise, ms, label) => {
        let timer;
        const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label || 'GenAI'} timeout after ${ms}ms`)), ms); });
        try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
      };
      console.log('[previewWorker] calling genai', {
        modelId,
        mode: 'worker-json',
        promptPreview: String(textPrompt || '').slice(0, 200)
      });
      const result = await withTimeout(
        genAI.models.generateContent({
          model: modelId,
          contents: [ { role: 'user', parts: [{ text: textPrompt }] } ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                candleName: { type: 'string' },
                paragraphs: { type: 'array', items: { type: 'string' } },
                materials: { type: 'array', items: { type: 'string' } },
                recipe: {
                  type: 'object',
                  properties: {
                    size: { type: 'string' },
                    waxType: { type: 'string' },
                    waxAmount: { type: 'string' },
                    fragranceAmount: { type: 'string' },
                    instructions: { type: 'string' }
                  }
                }
              },
              required: ['candleName', 'paragraphs', 'materials']
            }
          }
        }),
        25000,
        'GenAI'
      );
      const raw = (result && result.response && result.response.text && result.response.text()) || result.text || '';
      console.log('[previewWorker] genai raw response preview', { sample: String(raw || '').slice(0, 240) });
      let ai;
      try { ai = raw ? JSON.parse(raw) : {}; } catch { ai = {}; }
      const candleName = (ai && typeof ai.candleName === 'string' && ai.candleName.trim()) ? ai.candleName.trim() : 'Your Magic Candle';
      const paragraphs = Array.isArray(ai?.paragraphs) ? ai.paragraphs.map(s => String(s).trim()).filter(Boolean).slice(0, 2) : [];
      let materials = Array.isArray(ai?.materials) ? ai.materials.map(s => String(s).trim()).filter(Boolean) : [];
      materials = Array.from(new Set(materials));
      const recipe = ai && ai.recipe && typeof ai.recipe === 'object' ? ai.recipe : null;
      let html = `
<div id="candle-preview">
  <style>
    #candle-preview{font-family:Poppins,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#FEF9E7;color:#222;border-radius:12px;padding:20px;border:1px solid #eee}
    #candle-preview h2{font-family:Nunito,sans-serif;margin:0 0 8px 0;font-size:22px;color:#111}
    #candle-preview p{margin:8px 0 0 0;line-height:1.5}
    #candle-preview ul{margin:8px 0 0 18px}
    #candle-preview .accent{color:#F25287}
    #candle-preview .meta{opacity:.8;font-size:12px;margin-top:10px}
  </style>
  <h2 class="accent">${candleName.replace(/</g,'&lt;')}</h2>
  ${paragraphs.map(p => `<p>${p.replace(/</g,'&lt;')}</p>`).join('')}
  ${materials.length ? `<ul>${materials.map(m => `<li>${m.replace(/</g,'&lt;')}</li>`).join('')}</ul>` : ''}
</div>`;
      html = html
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[\u2028\u2029]/g, ' ')
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/ on\w+="[^"]*"/gi, '')
        .replace(/ on\w+='[^']*'/gi, '')
        .trim();

      // Strict validation: if no HTML, treat as failure and stop early
      if (!html) {
        const msg = ai && ai.error ? String(ai.error) : 'AI returned no html';
        await dynamodb.update({
          TableName: table,
          Key: { jobId },
          UpdateExpression: 'SET #s = :e, #je = :m, errorMessage = :m, updatedAt = :u',
          ExpressionAttributeNames: { '#s': 'status', '#je': 'jobError' },
          ExpressionAttributeValues: {
            ':e': 'ERROR',
            ':m': `${msg}. raw=${String(raw || '').slice(0, 200)}`,
            ':u': Date.now()
          }
        }).promise();
        continue;
      }

      // Compute scent tier and options
      const count = materials.length;
      let scentTier = 'Standard (0-4 Scents)';
      if (count === 5) scentTier = 'Complex I (5 Scents)';
      else if (count === 6) scentTier = 'Complex II (6 Scents)';
      else if (count >= 7) scentTier = 'Complex III (7 Scents)';
      const variantOptions = { 'Wick': args.wick, 'Jar': args.jar, 'Scent Tier': scentTier };

      // Shopify: resolve variant and add/create cart
      let productHandle = '';
      if (String(args.size).includes('8oz')) productHandle = 'custom-candle-spark-8oz';
      else if (String(args.size).includes('12oz')) productHandle = 'custom-candle-flame-12oz';
      else if (String(args.size).includes('16oz')) productHandle = 'custom-candle-glow-16oz';

      let variantId = null;
      let cartId = args.cartId || null;
      try {
        const getVariantQuery = `
          query getProductVariant($handle: String!, $options: [SelectedOptionInput!]!) {
            product(handle: $handle) {
              variantBySelectedOptions(selectedOptions: $options) { id }
            }
          }
        `;
        const selectedOptions = [
          { name: 'Wick', value: args.wick },
          { name: 'Jar', value: args.jar },
          { name: 'Scent Tier', value: scentTier },
        ];
        const variantData = await shopifyStorefront(getVariantQuery, { handle: productHandle, options: selectedOptions }, 15000);
        variantId = variantData?.data?.product?.variantBySelectedOptions?.id || null;

        if (variantId) {
          const attributes = [
            { key: 'Candle Name', value: ai?.candleName || 'Your Magic Candle' },
            { key: 'Original Prompt', value: String(args.prompt || '').slice(0, 100) },
          ];
          // Tag the line with the job id so the frontend can precisely spotlight and undo
          if (jobId) attributes.push({ key: '_creation_job_id', value: String(jobId) });
          // Add recipe details as line item properties for the merchant (hidden keys)
          if (recipe) {
            const waxLine = [recipe.waxType, recipe.waxAmount].filter(Boolean).join(': ');
            const fragLine = recipe.fragranceAmount || '';
            const instrLine = (recipe.instructions ? String(recipe.instructions) : '').slice(0, 200);
            if (waxLine) attributes.push({ key: '_recipe_wax', value: waxLine });
            if (fragLine) attributes.push({ key: '_recipe_fragrance', value: fragLine });
            if (instrLine) attributes.push({ key: '_recipe_instructions', value: instrLine });
            if (recipe.size) attributes.push({ key: '_recipe_size', value: String(recipe.size) });
          }
          if (cartId) {
            const addToCartMutation = `
              mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
                cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id lines(first: 1) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } }
              }
            `;
            const cartData = await shopifyStorefront(addToCartMutation, { cartId, lines: [{ merchandiseId: variantId, quantity: 1, attributes }] }, 15000);
            cartId = cartData?.data?.cartLinesAdd?.cart?.id || cartId;
          } else {
            const createCartMutation = `
              mutation cartCreate($input: CartInput!) {
                cartCreate(input: $input) { cart { id lines(first: 1) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } }
              }
            `;
            const cartData = await shopifyStorefront(createCartMutation, { input: { lines: [{ merchandiseId: variantId, quantity: 1, attributes }] } }, 15000);
            cartId = cartData?.data?.cartCreate?.cart?.id || cartId;
          }
        }
      } catch (e) {
        console.error('[worker] shopify error', e?.message);
        await dynamodb.update({
          TableName: table,
          Key: { jobId },
          UpdateExpression: 'SET #s = :e, #je = :m, errorMessage = :m, updatedAt = :u',
          ExpressionAttributeNames: { '#s': 'status', '#je': 'jobError' },
          ExpressionAttributeValues: { ':e': 'ERROR', ':m': e?.message || 'Shopify error', ':u': Date.now() }
        }).promise();
        continue;
      }

      await dynamodb.update({
        TableName: table,
        Key: { jobId },
        UpdateExpression: 'SET #s = :r, html = :h, aiJson = :j, materials = :m, scentTier = :t, variantOptions = :vo, cartId = :c, variantId = :v, updatedAt = :u, recipe = :rc, candle = :cd',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: {
          ':r': 'READY',
          ':h': html,
          ':j': ai || {},
          ':m': materials,
          ':t': scentTier,
          ':vo': variantOptions,
          ':c': cartId,
          ':v': variantId,
          ':u': Date.now(),
          ':rc': recipe || {},
          ':cd': { name: candleName, size: args.size, waxType: args.wax }
        }
      }).promise();
    } catch (e) {
      await dynamodb.update({
        TableName: table,
        Key: { jobId },
        UpdateExpression: 'SET #s = :e, #je = :m, errorMessage = :m, updatedAt = :u',
        ExpressionAttributeNames: { '#s': 'status', '#je': 'jobError' },
        ExpressionAttributeValues: { ':e': 'ERROR', ':m': e?.message || 'unknown', ':u': Date.now() }
      }).promise();
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
const shopifyStorefront = async (query, variables, timeoutMs = 15000) => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || '';
  const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN || '';
  if (!domain || !token) {
    throw new Error('Shopify env missing: SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_API_TOKEN');
  }
  const endpoint = `https://${domain}/api/2024-07/graphql.json`;
  console.log('[shopify] endpoint', { endpoint, hasToken: token ? true : false });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    const text = await response.text();
    let data = undefined;
    try { data = text ? JSON.parse(text) : undefined; } catch (_e) {}
    if (!response.ok || (data && data.errors)) {
      const errPayload = {
        status: response.status,
        endpoint,
        hasToken: !!token,
        errors: data && data.errors ? data.errors : null,
        body: String(text).slice(0, 300)
      };
      throw new Error(`Shopify Storefront error: ${JSON.stringify(errPayload)}`);
  }
  return data;
  } catch (e) {
    throw new Error(`Shopify request failed: ${e?.message || 'unknown'}`);
  } finally {
    clearTimeout(timer);
  }
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
