// amplify/functions/magic-request/handler.ts
import { Handler } from 'aws-lambda';
import { GoogleGenAI } from "@google/genai";

// The constructor takes an options object with the key
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function callShopifyAdminAPI(payload: object): Promise<Record<string, unknown>> {
  const apiUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/draft_orders.json`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Shopify API Error:", errorBody);
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }
  return response.json();
}

type InputEvent = {
    body?: string;
    prompt?: string;
    size?: string;
}

export const handler: Handler<InputEvent, { statusCode: number; headers: Record<string, string>; body: string; }> = async (event) => {
  if (!process.env.GEMINI_API_KEY || !process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_ADMIN_API_TOKEN) {
    console.error("Missing required environment variables.");
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Server configuration error: Missing required secrets." }),
    };
  }

  try {
    const requestBody = event.body ? JSON.parse(event.body) : event;
    const { prompt, size } = requestBody;

    if (!prompt || !size) {
        throw new Error("Missing 'prompt' or 'size' in the request body.");
    }

    const customerPrompt = `You are a scent poet. Based on the user's request of '${prompt}', write an evocative, beautiful description for a custom candle. The description must include a creative name for the candle, formatted exactly like this: **Candle Name:** "The Scholar's Study". Also describe the top, middle, and base fragrance notes.`;
    
    // This is the correct syntax you provided.
    const customerResult = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: customerPrompt }] }],
    });
    const customerDescription = customerResult.text ?? '';

    const nameMatch = customerDescription.match(/\*\*Candle Name:\*\*\s*"(.*?)"/);
    const candleName = nameMatch ? nameMatch[1] : "Your Custom Candle";

    const clientPrompt = `You are a master chandler. Based on the request '${prompt}' for an ${size} candle, create a practical recipe. Deconstruct the scent into a list of fragrance oils and their parts (e.g., 3 parts sandalwood, 2 parts rain). Output ONLY a valid JSON object with the keys: "essences" (an array of strings), "waxType" (string), and "wickType" (string). Example: {"essences": ["Sandalwood: 3 parts", "Rain Fragrance Oil: 2 parts"], "waxType": "Soy Wax", "wickType": "Cotton Wick"}`;

    const clientResult = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: clientPrompt }] }],
    });
    const recipeJsonString = (clientResult.text ?? "").replace(/```json|```/g, '').trim();
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
              ...recipe.essences.map((essence: string, index: number) => ({
                name: `Essence ${index + 1}`,
                value: essence
              }))
            ]
          }
        ],
        note: `Recipe: Wax - ${recipe.waxType}, Wick - ${recipe.wickType}`
      }
    };

    await callShopifyAdminAPI(draftOrderPayload);
    
    const finalResult = {
        candleName: candleName,
        description: customerDescription,
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(finalResult),
    };

  } catch (error: unknown) {
    console.error("Error in Lambda handler:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: message }),
    };
  }
};
