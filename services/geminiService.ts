
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts structured financial data from raw ride-sharing CSV/text.
 */
export const analyzeReport = async (csvData: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a specialized CRMS financial auditor. Analyze this raw text data from an OLA/UBER partner dashboard and extract a list of settlement objects.
    
    Data: ${csvData}
    
    Instructions:
    - If data is sparse, invent realistic values for missing fields to provide a full demo experience.
    - Calculate net payable as (earnings - commission - tolls).`,
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
            tolls: { type: Type.NUMBER },
            ridesCount: { type: Type.INTEGER }
          },
          required: ["driverName", "earnings", "commission", "tolls", "ridesCount"]
        }
      }
    }
  });
  
  return JSON.parse(response.text || "[]");
};

/**
 * Provides strategic business advice based on current fleet performance.
 */
export const suggestBillingOptimizations = async (history: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this CRMS fleet settlement history and provide 3 high-impact, professional bullet points to optimize operational efficiency, reduce maintenance overhead, or improve driver retention.
    
    History Summary: ${JSON.stringify(history)}
    
    Format: Return only 3 concise bullet points starting with appropriate emojis.`,
  });
  return response.text;
};

/**
 * Suggests best driver-vehicle pairings based on status and model.
 */
export const suggestAutoMapping = async (drivers: any[], vehicles: any[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Review this list of unassigned drivers and idle vehicles. Suggest the most logical pairing for the next shift.
    
    Drivers: ${JSON.stringify(drivers)}
    Vehicles: ${JSON.stringify(vehicles)}
    
    Response: Provide a single sentence recommendation explaining why this specific pairing is optimal.`,
  });
  return response.text;
};
