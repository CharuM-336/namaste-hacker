/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ParsedPDF } from "@/types/book";
// pdfjs-dist imported dynamically below

// ─── Types ────────────────────────────────────────────────────────────────────

interface PDFMetaInfo {
  info: Record<string, unknown>;
}

// ─── Text chunker ─────────────────────────────────────────────────────────────

if (typeof global !== "undefined" && typeof global.DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() {}
  };
}

if (typeof Uint8Array !== "undefined" && !(Uint8Array.prototype as any).toHex) {
  (Uint8Array.prototype as any).toHex = function () {
    return Array.from(this as Uint8Array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };
}

if (typeof Map !== "undefined" && !(Map.prototype as any).getOrInsertComputed) {
  (Map.prototype as any).getOrInsertComputed = function (key: any, callback: any) {
    if (this.has(key)) return this.get(key);
    const value = callback(key);
    this.set(key, value);
    return value;
  };
}

const CHUNK_WORD_SIZE = 400;
const CHUNK_OVERLAP = 40;

export function chunkText(
  text: string,
  chunkSize = CHUNK_WORD_SIZE,
  overlap = CHUNK_OVERLAP,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let i = 0;

  while (i < words.length) {
    const slice = words.slice(i, i + chunkSize);
    chunks.push(slice.join(" "));
    i += chunkSize - overlap;
  }

  return chunks;
}

// ─── Title / author extraction ────────────────────────────────────────────────

function cleanTitleText(text: string): string {
  return text
    .replace(/\.pdf$/i, "")
    .replace(/\\/g, "")
    .replace(/\(?\s*PDFDrive\.com\s*\)?/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitleFromFilename(fileName: string): {
  title: string;
  author: string;
} {
  const base = cleanTitleText(fileName);
  const parts = base.split(/\s+-\s+/);

  const title = (parts[0] ?? base)
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const author = (parts[1] ?? "Unknown Author")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return { title, author };
}

function extractTitleFromMeta(
  meta: PDFMetaInfo,
  fileName: string,
): { title: string; author: string } {
  const rawTitle =
    typeof meta.info["Title"] === "string" && meta.info["Title"].length > 1
      ? meta.info["Title"]
      : null;

  const rawAuthor =
    typeof meta.info["Author"] === "string" && meta.info["Author"].length > 1
      ? meta.info["Author"]
      : null;

  if (rawTitle) {
    const cleanedTitle = cleanTitleText(rawTitle);
    // If the cleaned internal metadata title becomes empty (e.g. it was just ".pdf"), fall back to filename
    if (cleanedTitle) {
      return {
        title: cleanedTitle,
        author: rawAuthor?.trim() ?? extractTitleFromFilename(fileName).author,
      };
    }
  }

  return extractTitleFromFilename(fileName);
}

// ─── Main parser ──────────────────────────────────────────────────────────────

export async function parsePDF(
  buffer: Buffer,
  fileName: string,
): Promise<ParsedPDF> {
  const pdfjs = await import("pdfjs-dist");

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    // Suppress font-related warnings in server logs
    verbosity: 0,
  });

  const doc = await loadingTask.promise;
  const numPages = doc.numPages;

  // Pull PDF metadata
  const meta = (await doc.getMetadata()) as unknown as PDFMetaInfo;
  const { title, author } = extractTitleFromMeta(meta, fileName);

  // Extract text per page (cap at 120 pages for performance)
  const pageCap = Math.min(numPages, 120);
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pageCap; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();

    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim();

    pageTexts.push(text);
  }

  const fullText = pageTexts.join("\n\n");
  const firstPageText = pageTexts[0] ?? "";

  return {
    title,
    author,
    pages: numPages,
    fullText,
    firstPageText,
    pageTexts,
  };
}
