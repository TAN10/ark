
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client. 
// Note: process.env.API_KEY is injected by the environment.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeReport = async (csvData: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this ride-sharing report data and extract key financial metrics (earnings, commissions) per driver. 
    Data: ${csvData}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            driverName: { type: Type.STRING },
            earnings: { type: Type.NUMBER },
            commission: { type: Type.NUMBER },
            ridesCount: { type: Type.INTEGER }
          },
          required: ["driverName", "earnings", "commission", "ridesCount"]
        }
      }
    }
  });
  
  return JSON.parse(response.text || "[]");
};

export const suggestBillingOptimizations = async (history: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this driver settlement history, provide 3 bullet points on how to optimize fleet efficiency or reduce fines.
    History: ${JSON.stringify(history)}`,
  });
  return response.text;
};
