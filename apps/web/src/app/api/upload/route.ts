import { type NextRequest } from "next/server";

import {
  processUpload,
  validateUploadInput,
} from "@/lib/services/upload.service";
import { created, errorResponse } from "@/lib/utils/response";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    const { Errors } = await import("@/lib/utils/errors");
    return errorResponse(
      Errors.invalidInput("Request body must be multipart/form-data"),
    );
  }

  const validation = await validateUploadInput(formData);
  if (!validation.success) return errorResponse(validation.error);

  const result = await processUpload(
    validation.data.buffer,
    validation.data.fileName,
  );
  if (!result.success) return errorResponse(result.error);

  return created(result.data);
}
