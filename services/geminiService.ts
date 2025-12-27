
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AgentMode } from "../types";
import { SYSTEM_INSTRUCTIONS, MODEL_NAME } from "../constants";

export const getGeminiResponse = async (
  prompt: string, 
  history: { role: string; content: string }[],
  mode: AgentMode
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = SYSTEM_INSTRUCTIONS[mode];
  
  // Format history for Gemini API
  const contents = [
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    return response.text || "I encountered an error processing your request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to Montenegro AI servers. Please ensure your environment is configured correctly.";
  }
};
