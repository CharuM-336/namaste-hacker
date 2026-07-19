import { getAllBooks } from "@/lib/engine/book-engine";
import { errorResponse, ok } from "@/lib/utils/response";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getAllBooks();
  if (!result.success) return errorResponse(result.error);
  return ok(result.data);
}
