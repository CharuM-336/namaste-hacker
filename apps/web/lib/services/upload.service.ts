import { generateMetadata as geminiGenerateMetadata } from "@/lib/ai/gemini";
import { generateBookWorld, getBookById } from "@/lib/engine/book-engine";
import { parsePDF } from "@/lib/pdf/parser";
import { Errors } from "@/lib/utils/errors";
import type { BookWorld, ServiceResult, UploadResult } from "@/types/book";

// ─── Input validation ─────────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_MIME = "application/pdf";

interface ValidatedUpload {
  buffer: Buffer;
  fileName: string;
}

export async function validateUploadInput(
  formData: FormData,
): Promise<ServiceResult<ValidatedUpload>> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { success: false, error: Errors.invalidInput("No file provided") };
  }

  if (file.type !== ALLOWED_MIME && !file.name.toLowerCase().endsWith(".pdf")) {
    return {
      success: false,
      error: Errors.invalidInput("Only PDF files are accepted"),
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: Errors.invalidInput("File exceeds the 50 MB limit"),
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  return {
    success: true,
    data: {
      buffer: Buffer.from(arrayBuffer),
      fileName: file.name,
    },
  };
}

// ─── Upload flow ──────────────────────────────────────────────────────────────

export async function processUpload(
  buffer: Buffer,
  fileName: string,
): Promise<ServiceResult<UploadResult>> {
  // 1. Parse PDF
  let parsed;
  try {
    parsed = await parsePDF(buffer, fileName);
  } catch (err) {
    console.error("PDF Parsing Error:", err instanceof Error ? err.message : err);
    return {
      success: false,
      error: Errors.pdfParseFailed(
        err instanceof Error ? err.message : String(err),
      ),
    };
  }
  
  // Verify it is actually a book/readable document
  if (!parsed.fullText || parsed.fullText.trim().length < 500) {
    return {
      success: false,
      error: Errors.invalidInput("The uploaded PDF does not contain enough readable text to be processed as a book."),
    };
  }

  // 2. Generate metadata via Gemini
  const metadataResult = await geminiGenerateMetadata(
    parsed.title,
    parsed.author,
    parsed.firstPageText || parsed.fullText.slice(0, 2000),
  );

  if (!metadataResult.success) {
    return { success: false, error: metadataResult.error };
  }

  // 3. Run the full Book Intelligence Engine
  const worldResult = await generateBookWorld(parsed, metadataResult.data);

  if (!worldResult.success) {
    return { success: false, error: worldResult.error };
  }

  return { success: true, data: { bookId: worldResult.data.id } };
}

// ─── Book retrieval ────────────────────────────────────────────────────────────

export async function fetchBook(id: string): Promise<ServiceResult<BookWorld>> {
  return getBookById(id);
}
