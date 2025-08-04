const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
  try {
    console.log('Full event:', JSON.stringify(event, null, 2));
    
    // Parse the arguments string
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

    const customerPrompt = `You are a scent poet. Based on the user's request of '${prompt}', write an evocative, beautiful description for a custom candle. The description must include a creative name for the candle, formatted exactly like this: **Candle Name:** "The Scholar's Study". Also describe the top, middle, and base fragrance notes.`;
    
    const customerResult = await model.generateContent(customerPrompt);
    const customerDescription = customerResult.response.text();

    const nameMatch = customerDescription.match(/\*\*Candle Name:\*\*\s*"(.*?)"/);
    const candleName = nameMatch ? nameMatch[1] : "Your Custom Candle";

    const clientPrompt = `You are a master chandler. Based on the request '${prompt}' for an ${size} candle, create a practical recipe. Deconstruct the scent into a list of fragrance oils and their parts (e.g., 3 parts sandalwood, 2 parts rain). Output ONLY a valid JSON object with the keys: "essences" (an array of strings), "waxType" (string), and "wickType" (string). Example: {"essences": ["Sandalwood: 3 parts", "Rain Fragrance Oil: 2 parts"], "waxType": "Soy Wax", "wickType": "Cotton Wick"}`;

    const clientResult = await model.generateContent(clientPrompt);
    const recipeJsonString = clientResult.response.text().replace(/```json|```/g, '').trim();
    const recipe = JSON.parse(recipeJsonString);
    
    const draftOrderPayload = {
      draft_order: {
        line_items: [
          {
            title: `Magic Request: ${candleName}`,
            price: "35.00",
            quantity: 1,
            custom: true,
            properties: [
              { name: "Scent Profile", value: prompt },
              { name: "Size", value: size },
              ...recipe.essences.map((essence, index) => ({
                name: `Essence ${index + 1}`,
                value: essence
              }))
            ]
          }
        ],
        note: `Recipe: Wax - ${recipe.waxType}, Wick - ${recipe.wickType}`
      }
    };

    const shopifyApiUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/draft_orders.json`;
    await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftOrderPayload),
    });
    
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