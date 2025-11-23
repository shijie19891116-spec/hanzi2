import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CharacterData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCharacterDetails = async (char: string): Promise<CharacterData> => {
  const modelId = "gemini-2.5-flash";

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      pinyin: { type: Type.STRING, description: "The Pinyin pronunciation of the character with tone marks (e.g., māo)." },
      definition: { type: Type.STRING, description: "A concise English definition of the character." },
      example: { type: Type.STRING, description: "A simple Chinese example sentence using the character." },
      exampleTranslation: { type: Type.STRING, description: "The English translation of the example sentence." },
    },
    required: ["pinyin", "definition", "example", "exampleTranslation"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Provide learning details for the Chinese character: ${char}. Ensure the pinyin is accurate and the example is simple.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text);
    return {
      char,
      pinyin: data.pinyin,
      definition: data.definition,
      example: data.example,
      exampleTranslation: data.exampleTranslation,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return fallback data in case of error
    return {
      char,
      pinyin: "Unknown",
      definition: "Could not retrieve definition.",
      example: "N/A",
      exampleTranslation: "Please check your API Key or connection.",
    };
  }
};