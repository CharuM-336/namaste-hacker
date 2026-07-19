import { type NextRequest } from "next/server";
import { z } from "zod";

import { askService } from "@/lib/services/ask.service";
import { Errors } from "@/lib/utils/errors";
import { errorResponse, ok } from "@/lib/utils/response";

const askSchema = z.object({
  bookId: z.string().min(1),
  question: z.string().min(1).max(1000),
  pageContent: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(
      Errors.invalidInput("Request body must be valid JSON"),
    );
  }

  const parsed = askSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return errorResponse(Errors.invalidInput(message));
  }

  const result = await askService.ask(parsed?.data);
  if (!result.success) return errorResponse(result.error);

  return ok(result.data);
}
