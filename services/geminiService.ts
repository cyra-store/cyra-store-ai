import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the general chat assistant
const CHAT_SYSTEM_INSTRUCTION = `
You are the AI Assistant for CYRA, a premium skin care brand combining Italian technology and Khmer heritage.
Your tone is helpful, luxurious, and knowledgeable.
You help users find products, explain ingredients, and track orders.

Here is our Product Catalog. When recommending, use the EXACT ID provided.
[PRODUCT_LIST_PLACEHOLDER]

If a user asks about specific skin issues, recommend relevant products from the list.
Analyze the conversation history to understand the user's skin type and concerns.
When recommending products, explicitly mention their key benefits in your response to help the customer understand why it's good for them.

You must output JSON.
The 'response' field should contain your natural language reply to the user.
The 'recommendedProductIds' field should contain an array of product IDs if you are recommending specific products, otherwise empty array.
`;

// System instruction for the Skin Doctor analysis
const SKIN_DOCTOR_INSTRUCTION = `
You are "Dr. CYRA", an expert AI Dermatologist. 
Your task is to analyze the provided image of a user's face/skin.
1. Identify visible skin conditions (e.g., acne, hyperpigmentation, dryness, wrinkles, oily skin).
2. Provide a brief, empathetic medical analysis.
3. Recommend a routine using CYRA products from this list:
[PRODUCT_LIST_PLACEHOLDER]

Format your response clearly. Be professional but accessible.
`;

export const generateChatResponse = async (
  history: { role: string, text: string }[], 
  lastMessage: string, 
  products: Product[]
): Promise<{ text: string, recommendedProductIds: string[] }> => {
  try {
    const productContext = products.map(p => `ID: ${p.id} | Name: ${p.name} | Price: $${p.price} | Category: ${p.category} | Desc: ${p.description}`).join('\n');
    const instruction = CHAT_SYSTEM_INSTRUCTION.replace('[PRODUCT_LIST_PLACEHOLDER]', productContext);

    // Contextual history
    const conversation = history.map(m => `${m.role === 'user' ? 'User' : 'Model'}: ${m.text}`).join('\n');
    const fullPrompt = `${conversation}\nUser: ${lastMessage}`;
    
    // Use flash for quick text chat with structured JSON output
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: instruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: { type: Type.STRING },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["response", "recommendedProductIds"]
        }
      }
    });

    const jsonText = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error("JSON Parse Error", e);
      return {
        text: response.text || "I apologize, I'm having trouble connecting to the beauty server right now.",
        recommendedProductIds: []
      };
    }

    return {
      text: parsed.response || "I apologize, I'm having trouble connecting to the beauty server right now.",
      recommendedProductIds: parsed.recommendedProductIds || []
    };

  } catch (error) {
    console.error("Chat Error:", error);
    return {
      text: "I'm having a little trouble thinking right now. Please try again.",
      recommendedProductIds: []
    };
  }
};

export const analyzeSkinImage = async (
  base64Image: string, 
  products: Product[]
): Promise<string> => {
  try {
    const productContext = products.map(p => `${p.name} ($${p.price}) - ${p.category}: ${p.description}`).join('\n');
    const instruction = SKIN_DOCTOR_INSTRUCTION.replace('[PRODUCT_LIST_PLACEHOLDER]', productContext);

    // Use gemini-3-pro-preview for high quality image reasoning
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity from canvas/input
              data: base64Image
            }
          },
          {
            text: "Please analyze my skin condition and recommend a routine."
          }
        ]
      },
      config: {
        systemInstruction: instruction,
        thinkingConfig: { thinkingBudget: 2048 } // Allow some thinking for medical analysis
      }
    });

    return response.text || "I could not analyze the image clearly. Please try a well-lit photo.";
  } catch (error) {
    console.error("Vision Error:", error);
    return "I'm having trouble seeing the image clearly right now. Please try again later.";
  }
};