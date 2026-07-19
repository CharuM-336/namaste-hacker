import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response2 = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "hi",
    });
    console.log("2.5 Flash:", response2.text);
  } catch (err) {
    console.error("Error Gen:", err);
  }
}
test();
