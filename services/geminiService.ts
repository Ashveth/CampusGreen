
import { GoogleGenAI } from "@google/genai";

// Fix: Always use process.env.API_KEY directly when initializing the client
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSustainabilityAdvice = async (query: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "You are CampusGreen AI, an expert sustainability assistant for college students. Provide short, actionable, and encouraging advice for living a greener life on campus. Keep responses under 150 words.",
        temperature: 0.7,
      },
    });
    // Fix: Access response.text directly (not as a method)
    return response.text || "I'm having trouble thinking of green tips right now. Try again soon!";
  } catch (error) {
    console.error("AI Error:", error);
    return "The eco-conscious part of my brain is recharging. Please try again later!";
  }
};

export const getDailyEcoTip = async (completedChallenges: string[]): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `The student has completed these challenges: ${completedChallenges.join(', ') || 'none yet'}. Provide a single, personalized daily eco-tip for a university student. Keep it to one or two sentences.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert sustainability coach. Provide a single, catchy, and helpful daily eco-tip for a student.",
        temperature: 0.9,
      },
    });
    // Fix: Access response.text directly (not as a method)
    return response.text || "Carry a reusable water bottle today!";
  } catch (error) {
    return "Small actions lead to big changes. Try to reduce your plastic use today!";
  }
};
