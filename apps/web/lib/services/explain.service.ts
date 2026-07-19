import { explainText as geminiExplain } from "@/lib/ai/gemini";
import { retrieveChunks } from "@/lib/engine/book-engine";
import { Errors } from "@/lib/utils/errors";
import type { ExplainResult, ServiceResult } from "@/types/book";

// ─── Input types ──────────────────────────────────────────────────────────────

export interface ExplainInput {
  bookId: string;
  text: string;
  surroundingContext?: string | undefined;
}

// ─── Explain service ──────────────────────────────────────────────────────────

export const explainService = {
  /**
   * Explains a word, phrase, or concept highlighted by the reader.
   * Uses surrounding context from the book's vector store when available.
   */
  async explain(input: ExplainInput): Promise<ServiceResult<ExplainResult>> {
    if (!input.text.trim()) {
      return {
        success: false,
        error: Errors.invalidInput("Text to explain cannot be empty"),
      };
    }

    if (input.text.length > 500) {
      return {
        success: false,
        error: Errors.invalidInput(
          "Selected text is too long (max 500 characters)",
        ),
      };
    }

    // If no explicit context was provided, retrieve relevant chunks from AstraDB
    let context = input.surroundingContext ?? "";

    if (!context) {
      const chunkResult = await retrieveChunks(input.bookId, input.text, 2);
      if (chunkResult.success && chunkResult.data.length > 0) {
        context = chunkResult.data.join("\n\n");
      }
    }

    return geminiExplain(input.text, context);
  },
} as const;
