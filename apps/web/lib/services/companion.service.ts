import { generateCompanion as geminiGenerateCompanion } from "@/lib/ai/gemini";
import type { BookCompanion, BookGenre, ServiceResult } from "@/types/book";

// ─── Fallback companion names per genre ───────────────────────────────────────

const FALLBACK_NAMES: Record<BookGenre, string> = {
  fantasy: "Aldric",
  thriller: "Case",
  mystery: "Nora",
  romance: "Elara",
  "science-fiction": "Nova",
  philosophy: "Sophia",
  history: "Edmund",
  science: "Kepler",
  productivity: "Clarity",
  biography: "Marcus",
  fiction: "Arlo",
  "non-fiction": "Vera",
  unknown: "Vesper",
};

const FALLBACK_COLORS: Record<BookGenre, string> = {
  fantasy: "#6b3fa0",
  thriller: "#8b0000",
  mystery: "#4a6fa5",
  romance: "#c2415c",
  "science-fiction": "#5dade2",
  philosophy: "#d4ac0d",
  history: "#a0522d",
  science: "#3498db",
  productivity: "#2e7d5e",
  biography: "#5a5a5a",
  fiction: "#706fd3",
  "non-fiction": "#4a3f35",
  unknown: "#c4a05c",
};

// ─── Companion service ────────────────────────────────────────────────────────

export const companionService = {
  /**
   * Generates a reading companion character that feels like a real literary
   * mentor, not an AI assistant. Falls back gracefully if Gemini is unavailable.
   */
  async generate(
    title: string,
    genre: string,
    mood: string,
  ): Promise<ServiceResult<BookCompanion>> {
    const aiResult = await geminiGenerateCompanion(title, genre, mood);

    if (aiResult.success) {
      return aiResult;
    }

    // Graceful fallback — keep a consistent personality
    const safeGenre =
      (genre as BookGenre) in FALLBACK_NAMES ? (genre as BookGenre) : "unknown";

    return {
      success: true,
      data: buildFallbackCompanion(safeGenre),
    };
  },
} as const;

// ─── Fallback ─────────────────────────────────────────────────────────────────

function buildFallbackCompanion(genre: BookGenre): BookCompanion {
  const name = FALLBACK_NAMES[genre];
  const avatarColor = FALLBACK_COLORS[genre];

  return {
    name,
    tone: "warm",
    personality:
      "A thoughtful reader who believes every book changes you in ways you can't predict. They ask questions slowly, and sit with the silence before answering.",
    greeting: `I've been waiting to read this one with you. Where would you like to begin?`,
    style:
      "speaks in questions, offers brief vivid comparisons, cites passages quietly",
    avatarColor,
  };
}
