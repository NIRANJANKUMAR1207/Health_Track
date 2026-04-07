import { GoogleGenAI, Chat } from "@google/genai";

// ✅ Load API key safely
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("API key is missing. Check your .env.local file.");
}

console.log("API KEY:", apiKey);

// ✅ Initialize AI
const ai = new GoogleGenAI({ apiKey });

// ✅ Create chat instance
export const createHealthChat = (): Chat => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are a Smart Health Assistant. 
      Provide general wellness advice only.
      If asked for diagnosis or medication, say:
      "I am an AI assistant, not a doctor. Please consult a healthcare professional."
      Keep answers short and helpful.`,
    },
  });
};

// ✅ Send message helper (IMPORTANT)
export const sendMessageToChat = async (
  chat: Chat,
  message: string
): Promise<string> => {
  try {
    const response = await chat.sendMessage({
      message: message,
    });

    // ✅ Correct way to read response
    return response.text ?? "No response from AI.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};

// ✅ Generate report
export const generateHealthReport = async (
  data: any
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this health data and give 3 recommendations:\n${JSON.stringify(
                data
              )}`,
            },
          ],
        },
      ],
    });

    return response.text ?? "Unable to generate report.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error generating report. Please try again later.";
  }
};