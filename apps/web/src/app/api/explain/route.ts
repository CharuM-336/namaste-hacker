import { type NextRequest } from "next/server";
import { z } from "zod";

import { explainService } from "@/lib/services/explain.service";
import { Errors } from "@/lib/utils/errors";
import { errorResponse, ok } from "@/lib/utils/response";

const explainSchema = z.object({
  bookId: z.string().min(1),
  text: z.string().min(1).max(500),
  surroundingContext: z.string().max(2000).optional(),
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

  const parsed = explainSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return errorResponse(Errors.invalidInput(message));
  }

  const result = await explainService.explain(parsed.data);
  if (!result.success) return errorResponse(result.error);

  return ok(result.data);
}
