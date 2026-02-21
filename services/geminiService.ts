
import { GoogleGenAI, Type } from "@google/genai";
import { Vendor } from "../types";

export const getSmartMatches = async (query: string, vendors: Vendor[]) => {
  const vendorContext = vendors.map(v => ({
    id: v.id,
    name: v.name,
    category: v.category,
    location: v.location,
    priceRange: v.priceRange,
    isVerified: v.isVerified,
    // Fix: Using availableToday instead of non-existent availableThisWeekend
    availableNow: v.availableToday,
    bio: v.bio,
    // Note: infrastructuralRank and ratingAvg now exist on User interface
    rank: v.infrastructuralRank,
    rating: v.ratingAvg
  }));

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Missing Gemini API Key in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
      User Search Intent: "${query}"
      
      Database of Experts:
      ${JSON.stringify(vendorContext)}
      
      Role: You are 'HoldMyBeer', a helpful and expert guide connecting event organizers with the best talent in Nigeria.
      
      Instructions:
      1. Interpret Intent: The user query might be in Nigerian English or Pidgin (e.g., "I need person wey go snap fine picture for my wedding"). Translate this intent to find the right category (e.g., Photographer).
      2. Guide and teach: Briefly explain WHY you chose these matches.
      3. Connectivity: Focus on how easy it is to connect with these pros.
      4. Use warm, professional Nigerian tone. Use light slang like 'sharp', 'levels', 'no shaking'.
      5. Simplify: Don't use technical jargon like "infrastructure" or "nodes". Use "experts", "connections", "pros".
      6. Output MUST be valid JSON.
      
      Criteria:
      - Match by category and location primarily.
      - If they need something "urgent", prioritize 'availableNow'.
      
      Output Schema: JSON with "message" (the guiding text) and "recommendedIds" (array of strings).
    `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: 'Warm, guiding message explaining the matches.' },
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'The IDs of the experts that fit the query best.'
            }
          },
          required: ["message", "recommendedIds"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Gemini Match error:", e);
    return {
      message: "I've picked out some sharp experts who can handle your request easily. Take a look at these connections!",
      recommendedIds: vendors.slice(0, 3).map(v => v.id)
    };
  }
};
