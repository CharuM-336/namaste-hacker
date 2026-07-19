import { z } from "zod";

import type {
  AskResult,
  BookCompanion,
  BookMetadata,
  BookTheme,
  ExplainResult,
} from "@/types/book";

// ─── Shared primitives ────────────────────────────────────────────────────────

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex colour");

// ─── BookMetadata ─────────────────────────────────────────────────────────────

const bookMetadataSchema = z.object({
  genre: z.enum([
    "fantasy",
    "thriller",
    "mystery",
    "romance",
    "science-fiction",
    "philosophy",
    "history",
    "science",
    "productivity",
    "biography",
    "fiction",
    "non-fiction",
    "unknown",
  ]),
  mood: z.string().min(1).max(50),
  difficulty: z.enum(["light", "moderate", "dense"]),
  summary: z.string().min(10).max(600),
  keywords: z.array(z.string().min(1)).min(1).max(12),
  estimatedReadingTime: z.number().int().positive(),
});

// ─── BookTheme (partial — only what AI generates) ─────────────────────────────

const themeAiFieldsSchema = z.object({
  headingFont: z.enum(["serif", "sans-serif"]),
  bodyFont: z.enum(["serif", "sans-serif"]),
  layoutStyle: z.enum([
    "editorial",
    "minimal",
    "dramatic",
    "archival",
    "scientific",
  ]),
  motionStyle: z.enum(["fluid", "sharp", "gentle", "cinematic"]),
  tagline: z.string().min(3).max(200),
});

// ─── BookCompanion ────────────────────────────────────────────────────────────

const companionSchema = z.object({
  name: z.string().min(1).max(60),
  tone: z.enum([
    "warm",
    "scholarly",
    "poetic",
    "analytical",
    "philosophical",
    "playful",
  ]),
  personality: z.string().min(10).max(400),
  greeting: z.string().min(5).max(300),
  style: z.string().min(3).max(200),
  avatarColor: hexColor,
});

// ─── ExplainResult ────────────────────────────────────────────────────────────

const explainResultSchema = z.object({
  explanation: z.string().min(10).max(600),
  type: z.enum(["word", "phrase", "concept"]),
  examples: z.array(z.string().min(1)).min(1).max(4),
});

// ─── AskResult ────────────────────────────────────────────────────────────────

const askResultSchema = z.object({
  answer: z.string().min(5).max(800),
  confidence: z.enum(["high", "medium", "low"]),
  sources: z.array(z.string().min(1)).max(6),
});

// ─── Validation functions ─────────────────────────────────────────────────────
// Each returns the typed value on success and throws a descriptive error on failure.

function parseJsonFromModel(raw: string): unknown {
  // Strip any accidental markdown code fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();
  return JSON.parse(cleaned);
}

export function validateMetadata(raw: string): BookMetadata {
  const parsed = parseJsonFromModel(raw);
  return bookMetadataSchema.parse(parsed);
}

export function validateThemeAiFields(
  raw: string,
): Pick<
  BookTheme,
  "headingFont" | "bodyFont" | "layoutStyle" | "motionStyle" | "tagline"
> {
  const parsed = parseJsonFromModel(raw);
  return themeAiFieldsSchema.parse(parsed);
}

export function validateCompanion(raw: string): BookCompanion {
  const parsed = parseJsonFromModel(raw);
  return companionSchema.parse(parsed);
}

export function validateExplain(raw: string): ExplainResult {
  const parsed = parseJsonFromModel(raw);
  return explainResultSchema.parse(parsed);
}

export function validateAsk(raw: string): AskResult {
  const parsed = parseJsonFromModel(raw);
  return askResultSchema.parse(parsed);
}
