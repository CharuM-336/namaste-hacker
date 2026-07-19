import { type NextRequest } from "next/server";
import { z } from "zod";

import { notebookService } from "@/lib/services/notebook.service";
import { Errors } from "@/lib/utils/errors";
import { created, errorResponse, ok } from "@/lib/utils/response";

// ─── Validation schemas ───────────────────────────────────────────────────────

const listSchema = z.object({
  bookId: z.string().min(1),
});

const createSchema = z.object({
  bookId: z.string().min(1),
  type: z.enum(["quote", "question", "insight"]),
  content: z.string().min(1).max(2000),
  pageRef: z.number().int().positive().optional(),
});

const deleteSchema = z.object({
  noteId: z.string().min(1),
});

export const dynamic = "force-dynamic";

// ─── GET /api/notebook?bookId=xxx ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("bookId");

  const parsed = listSchema.safeParse({ bookId });
  if (!parsed.success) {
    return errorResponse(Errors.invalidInput("bookId query param is required"));
  }

  const result = await notebookService.getByBook(parsed.data.bookId);
  if (!result.success) return errorResponse(result.error);

  return ok(result.data);
}

// ─── POST /api/notebook ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      Errors.invalidInput("Request body must be valid JSON"),
    );
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return errorResponse(Errors.invalidInput(message));
  }

  const result = await notebookService.create(parsed.data);
  if (!result.success) return errorResponse(result.error);

  return created(result.data);
}

// ─── DELETE /api/notebook ─────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      Errors.invalidInput("Request body must be valid JSON"),
    );
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(Errors.invalidInput("noteId is required"));
  }

  const result = await notebookService.delete(parsed.data.noteId);
  if (!result.success) return errorResponse(result.error);

  return ok({ deleted: true });
}
