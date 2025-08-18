import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

export async function main(prompt) {
  try {
    console.log("Prompt being sent:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ type: "text", text: prompt }], // Correct format
    });

    console.log("AI response:", response);
    // Return the AI-generated text
    return response.output_text || response.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
