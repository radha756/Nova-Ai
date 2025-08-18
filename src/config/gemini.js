import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCkYyZCp5D-9eupx089svClSOVvRu_qZVo" });

export async function main(prompt) {
  try {
    // Log the prompt to ensure it's a string
    console.log("Prompt being sent:", prompt);

    // Ensure prompt is a string and doesn't contain any React component or DOM element
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",  // Replace with the correct model if needed
      contents: prompt,  // Make sure this is a string
    });

    console.log("AI response:", response);
    return response.text; // Return the generated text from AI
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;  // Throw error for the caller to handle
  }
}
