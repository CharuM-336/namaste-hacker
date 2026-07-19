import { GoogleGenAI } from "@google/genai";

import {
  COMPANION_PROMPT,
  EXPLAIN_PROMPT,
  METADATA_PROMPT,
  PAGE_QA_PROMPT,
  THEME_PROMPT,
} from "@/lib/ai/prompts";
import {
  validateAsk,
  validateCompanion,
  validateExplain,
  validateMetadata,
  validateThemeAiFields,
} from "@/lib/ai/validator";
import { normaliseError } from "@/lib/utils/errors";
import type {
  AskResult,
  BookCompanion,
  BookMetadata,
  BookPalette,
  BookTheme,
  ExplainResult,
  ServiceResult,
} from "@/types/book";

// ─── Client singleton ─────────────────────────────────────────────────────────

function getClient(): GoogleGenAI {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey });
}

// ─── Generation helpers ───────────────────────────────────────────────────────

async function generateJSON(prompt: string): Promise<string> {
  const ai = getClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
      maxOutputTokens: 8192,
    },
  });

  if (!response.text) {
    throw new Error("No text returned from Gemini");
  }
  return response.text;
}

async function embedText(text: string): Promise<number[]> {
  const ai = getClient();
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text.slice(0, 8000),
    config: {
      outputDimensionality: 768,
    },
  });
  
  const values = response.embeddings?.[0]?.values;
  if (!values) {
    throw new Error("No embeddings returned from Gemini");
  }
  return values;
}

// ─── Public helpers — only services call these ────────────────────────────────

export async function generateMetadata(
  title: string,
  author: string,
  sampleText: string,
): Promise<ServiceResult<BookMetadata>> {
  try {
    const raw = await generateJSON(METADATA_PROMPT(title, author, sampleText));
    return { success: true, data: validateMetadata(raw) };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

export async function generateThemeFields(
  title: string,
  genre: string,
  mood: string,
  palette: BookPalette,
): Promise<
  ServiceResult<
    Pick<
      BookTheme,
      "headingFont" | "bodyFont" | "layoutStyle" | "motionStyle" | "tagline"
    >
  >
> {
  try {
    const raw = await generateJSON(THEME_PROMPT(title, genre, mood, palette));
    return { success: true, data: validateThemeAiFields(raw) };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

export async function generateCompanion(
  title: string,
  genre: string,
  mood: string,
): Promise<ServiceResult<BookCompanion>> {
  try {
    const raw = await generateJSON(COMPANION_PROMPT(title, genre, mood));
    return { success: true, data: validateCompanion(raw) };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

export async function explainText(
  text: string,
  context: string,
): Promise<ServiceResult<ExplainResult>> {
  try {
    const raw = await generateJSON(EXPLAIN_PROMPT(text, context));
    return { success: true, data: validateExplain(raw) };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

export async function answerQuestion(
  question: string,
  chunks: string[],
  companion?: { name: string; tone: string; personality: string; style: string }
): Promise<ServiceResult<AskResult>> {
  try {
    const raw = await generateJSON(PAGE_QA_PROMPT(question, chunks, companion));
    return { success: true, data: validateAsk(raw) };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

export async function createEmbedding(
  text: string,
): Promise<ServiceResult<number[]>> {
  try {
    const vector = await embedText(text);
    return { success: true, data: vector };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}
