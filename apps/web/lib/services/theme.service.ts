import { generateThemeFields } from "@/lib/ai/gemini";
import { Errors } from "@/lib/utils/errors";
import type { BookPalette, BookTheme, ServiceResult } from "@/types/book";

// ─── Theme service ────────────────────────────────────────────────────────────

export const themeService = {
  /**
   * Builds a complete BookTheme by combining the genre-derived palette with
   * AI-generated typography and layout decisions.
   */
  async generate(
    title: string,
    genre: string,
    mood: string,
    palette: BookPalette,
  ): Promise<ServiceResult<BookTheme>> {
    const aiResult = await generateThemeFields(title, genre, mood, palette);

    if (!aiResult.success) {
      // Graceful fallback — never fail the entire upload over a theme
      return {
        success: true,
        data: buildFallbackTheme(palette),
      };
    }

    const theme: BookTheme = {
      // Colours come from the deterministic palette
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      paper: palette.paper,
      shadow: palette.shadow,
      // Typography + layout come from Gemini
      headingFont: aiResult.data.headingFont,
      bodyFont: aiResult.data.bodyFont,
      layoutStyle: aiResult.data.layoutStyle,
      motionStyle: aiResult.data.motionStyle,
      tagline: aiResult.data.tagline,
    };

    return { success: true, data: theme };
  },
} as const;

// ─── Fallback ─────────────────────────────────────────────────────────────────

function buildFallbackTheme(palette: BookPalette): BookTheme {
  return {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    paper: palette.paper,
    shadow: palette.shadow,
    headingFont: "serif",
    bodyFont: "serif",
    layoutStyle: "editorial",
    motionStyle: "gentle",
    tagline: "Every book deserves its own world.",
  };
}

// Prevent unused import warning — Errors is used in other services
void Errors;
