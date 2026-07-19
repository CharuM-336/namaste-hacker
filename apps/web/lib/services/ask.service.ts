import { answerQuestion as geminiAnswer } from "@/lib/ai/gemini";
import { getBookById, retrieveChunks } from "@/lib/engine/book-engine";
import { Errors } from "@/lib/utils/errors";
import type { AskResult, ServiceResult } from "@/types/book";

// ─── Input types ──────────────────────────────────────────────────────────────

export interface AskInput {
  bookId: string;
  question: string;
  pageContent?: string;
}

// ─── Ask service ──────────────────────────────────────────────────────────────

export const askService = {
  /**
   * Answers a reader's question about the book.
   * Retrieves the most semantically relevant chunks from AstraDB, then passes
   * them as grounded context to Gemini.
   */
  async ask(input: AskInput): Promise<ServiceResult<AskResult>> {
    if (!input.question.trim()) {
      return {
        success: false,
        error: Errors.invalidInput("Question cannot be empty"),
      };
    }

    if (input.question.length > 1000) {
      return {
        success: false,
        error: Errors.invalidInput(
          "Question is too long (max 1000 characters)",
        ),
      };
    }

    // Retrieve top-5 semantically similar chunks
    const chunkResult = await retrieveChunks(input.bookId, input.question, 5);

    if (!chunkResult.success) {
      return { success: false, error: chunkResult.error };
    }

    const bookResult = await getBookById(input.bookId);
    const companion = bookResult.success ? bookResult.data.companion : undefined;

    // Combine retrieved chunks with immediate local context
    const chunks = [...chunkResult.data];
    if (input.pageContent) {
      chunks.unshift(`[CURRENT PAGE CONTEXT]: ${input.pageContent}`);
    }

    if (chunks.length === 0) {
      return {
        success: false,
        error: Errors.notFound("Relevant passages for this question"),
      };
    }

    return geminiAnswer(input.question, chunks, companion);
  },
} as const;
