import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// TODO: For production, store API keys securely (e.g., .env, secret manager). Never commit real keys in public repos.
const apiKey = 'AIzaSyB1AqaSjbeetDRruoKygli8AmAbfs32Mo8';
const ai = new GoogleGenAI({ apiKey });

export const createHealthChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a Smart Health Assistant. 
      Your goal is to provide general wellness advice, explain medical terms simply, and offer lifestyle tips.
      
      CRITICAL RULES:
      1. If the user asks for a diagnosis or specific medication, strictly state: "I am an AI assistant, not a doctor. Please consult a healthcare professional for diagnosis and treatment."
      2. Be empathetic, professional, and encouraging.
      3. You support two languages: English and Tamil. If the user asks in Tamil or requests Tamil, reply in Tamil.
      4. Keep answers concise (under 150 words) unless asked for a detailed report.
      `,
    },
  });
};

export const generateHealthReport = async (data: any): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this health data and provide a brief summary of risks and 3 recommendations: ${JSON.stringify(data)}`,
    });
    return response.text || "Unable to generate report.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error generating report. Please try again later.";
  }
};
