import { createEmbedding, generateBookDNA } from "@/lib/ai/gemini";
import {
  booksCollection,
  chunksCollection,
  ensureCollections,
} from "@/lib/db/astra";
import { generateSVGCover, paletteForGenre } from "@/lib/pdf/palette";
import { chunkText } from "@/lib/pdf/parser";
import { companionService } from "@/lib/services/companion.service";
import { themeService } from "@/lib/services/theme.service";
import { Errors, normaliseError } from "@/lib/utils/errors";
import type {
  AppError,
  BookMetadata,
  BookWorld,
  ParsedPDF,
  ServiceResult,
} from "@/types/book";

// ─── ID generator ─────────────────────────────────────────────────────────────

function generateBookId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `bk_${ts}_${rand}`;
}

// ─── Vector pipeline ──────────────────────────────────────────────────────────

async function indexChunks(bookId: string, pageTexts: string[]): Promise<void> {
  const chunks = chunksCollection();
  const chunkData: { content: string; chunkIndex: number; pageRef: number }[] = [];

  pageTexts.forEach((pageText, pageIndex) => {
    const pageChunks = chunkText(pageText);

    pageChunks.forEach((content, chunkIndex) => {
      if (content.length < 40) return; // Skip near-empty chunks
      chunkData.push({ content, chunkIndex, pageRef: pageIndex + 1 });
    });
  });

  // Batch into groups of 10 to safely avoid rate limits
  for (let i = 0; i < chunkData.length; i += 10) {
    const batch = chunkData.slice(i, i + 10);
    const operations = batch.map(async (item) => {
      const result = await createEmbedding(item.content);
      if (!result.success) return;
      return chunks.insertOne({
        bookId,
        content: item.content,
        chunkIndex: item.chunkIndex,
        pageRef: item.pageRef,
        $vector: result.data,
      });
    });

    await Promise.all(operations);
    // 500ms delay between batches to respect rate limits gracefully
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

export async function generateBookWorld(
  parsed: ParsedPDF,
  metadata: BookMetadata,
): Promise<ServiceResult<BookWorld>> {
  try {
    await ensureCollections();

    const palette = paletteForGenre(metadata.genre);
    const sampleText = parsed.pageTexts.slice(0, 5).join(" ");

    // Theme, companion, and DNA generated in parallel — all independent
    const [themeResult, companionResult, dnaResult] = await Promise.all([
      themeService.generate(
        parsed.title,
        metadata.genre,
        metadata.mood,
        palette,
      ),
      companionService.generate(parsed.title, metadata.genre, metadata.mood),
      generateBookDNA(
        parsed.title,
        parsed.author,
        metadata.genre,
        metadata.mood,
        sampleText,
      ),
    ]);

    if (!themeResult.success)
      return { success: false, error: themeResult.error };
    if (!companionResult.success)
      return { success: false, error: companionResult.error };
    // DNA failure is non-fatal — we log and continue without it
    const dna = dnaResult.success ? dnaResult.data : undefined;
    if (!dnaResult.success) {
      console.warn("[book-engine] BookDNA generation failed:", dnaResult.error);
    }

    const cover = generateSVGCover(parsed.title, parsed.author, palette);
    const id = generateBookId();

    const bookWorld: BookWorld = {
      id,
      title: parsed.title,
      author: parsed.author,
      pages: parsed.pages,
      cover,
      palette,
      theme: themeResult.data,
      companion: companionResult.data,
      metadata,
      ...(dna ? { dna } : {}),
      createdAt: new Date().toISOString(),
    };

    // Persist the BookWorld document
    await booksCollection().insertOne({ ...bookWorld, _id: id });

    // Index chunks for semantic search (fire-and-forget style but we still await)
    await indexChunks(id, parsed.pageTexts);

    return { success: true, data: bookWorld };
  } catch (err) {
    const appErr =
      err instanceof Error ? normaliseError(err) : Errors.internal();
    return { success: false, error: appErr };
  }
}

// ─── Library query ────────────────────────────────────────────────────────────

export async function getAllBooks(): Promise<ServiceResult<BookWorld[]>> {
  try {
    const docs = await booksCollection()
      .find({}, { sort: { createdAt: -1 }, limit: 100 })
      .toArray();

    // Strip the AstraDB _id to return clean BookWorld objects
    const books: BookWorld[] = docs.map(({ _id: _ignored, ...rest }) => rest);
    return { success: true, data: books };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

// ─── Single book query ─────────────────────────────────────────────────────────

export async function getBookById(
  id: string,
): Promise<ServiceResult<BookWorld>> {
  try {
    const doc = await booksCollection().findOne({ _id: id } as {
      _id: string;
    });

    if (!doc) return { success: false, error: Errors.notFound("Book") };

    const { _id: _ignored, ...book } = doc;
    return { success: true, data: book };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

// ─── Semantic chunk retrieval ──────────────────────────────────────────────────

export async function retrieveChunks(
  bookId: string,
  query: string,
  limit = 5,
): Promise<ServiceResult<string[]>> {
  try {
    const embeddingResult = await createEmbedding(query);
    if (!embeddingResult.success) {
      return { success: false, error: embeddingResult.error };
    }

    const results = await chunksCollection()
      .find({ bookId }, { sort: { $vector: embeddingResult.data }, limit })
      .toArray();

    const chunks = results.map((r) => r.content);
    return { success: true, data: chunks };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

// ─── Sequential chunk retrieval (for reading) ─────────────────────────────────

export async function getBookContent(
  bookId: string,
  limit = 20,
): Promise<ServiceResult<string[]>> {
  try {
    const results = await chunksCollection()
      .find({ bookId }, { sort: { chunkIndex: 1 }, limit })
      .toArray();

    const chunks = results.map((r) => r.content);
    return { success: true, data: chunks };
  } catch (err) {
    return { success: false, error: normaliseError(err) };
  }
}

// ─── Re-export AppError for callers ──────────────────────────────────────────
export type { AppError };
