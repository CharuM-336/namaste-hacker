import type { AppError, ErrorCode } from "@/types/book";

// ─── Constructors ─────────────────────────────────────────────────────────────

function createError(
  code: ErrorCode,
  message: string,
  status: number,
): AppError {
  return { code, message, status };
}

// ─── Named error factories ────────────────────────────────────────────────────

export const Errors = {
  invalidInput: (message: string): AppError =>
    createError("INVALID_INPUT", message, 400),

  notFound: (resource: string): AppError =>
    createError("NOT_FOUND", `${resource} not found`, 404),

  pdfParseFailed: (detail?: string): AppError =>
    createError(
      "PDF_PARSE_FAILED",
      detail ?? "Failed to parse the uploaded PDF",
      422,
    ),

  aiUnavailable: (detail?: string): AppError =>
    createError(
      "AI_UNAVAILABLE",
      detail ?? "AI service is temporarily unavailable",
      503,
    ),

  dbError: (detail?: string): AppError =>
    createError("DB_ERROR", detail ?? "Database operation failed", 500),

  rateLimited: (): AppError =>
    createError(
      "RATE_LIMITED",
      "Too many requests — please try again later",
      429,
    ),

  internal: (detail?: string): AppError =>
    createError(
      "INTERNAL_ERROR",
      detail ?? "An unexpected error occurred",
      500,
    ),
} as const;

// ─── Normalise unknown thrown values ─────────────────────────────────────────

export function normaliseError(err: unknown): AppError {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("rate limit") || msg.includes("quota")) {
      return Errors.rateLimited();
    }
    if (msg.includes("api key") || msg.includes("authentication")) {
      return Errors.aiUnavailable("Invalid or missing API key");
    }
    return Errors.internal(err.message);
  }
  return Errors.internal();
}
