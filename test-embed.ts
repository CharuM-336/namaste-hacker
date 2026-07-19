import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    let response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: "test text",
    });
    console.log("Embeddings 2:", response.embeddings?.[0]?.values?.slice(0, 5));
  } catch (err) {
    console.error("Error 2:", err);
  }
}
test();
