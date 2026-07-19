import { type NextRequest } from "next/server";

import { getBookById } from "@/lib/engine/book-engine";
import { Errors } from "@/lib/utils/errors";
import { errorResponse, ok } from "@/lib/utils/response";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return errorResponse(Errors.invalidInput("Book ID is required"));
  }

  const result = await getBookById(id);
  if (!result.success) return errorResponse(result.error);

  return ok(result.data);
}
