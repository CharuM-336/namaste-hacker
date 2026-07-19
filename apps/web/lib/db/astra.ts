import { DataAPIClient } from "@datastax/astra-db-ts";

import type { BookNote, BookWorld } from "@/types/book";

// ─── Collection names ─────────────────────────────────────────────────────────

export const COLLECTIONS = {
  BOOKS: "inkverse_books",
  CHUNKS: "inkverse_chunks",
  NOTES: "inkverse_notes",
} as const;

// ─── Document interfaces ──────────────────────────────────────────────────────
// AstraDB stores documents as plain objects; we type them explicitly.

export interface BookDocument extends BookWorld {
  _id: string;
}

export interface ChunkDocument {
  _id?: string;
  bookId: string;
  content: string;
  chunkIndex: number;
  pageRef: number;
  $vector?: number[];
}

export interface NoteDocument extends BookNote {
  _id: string;
}

// ─── Client singleton ─────────────────────────────────────────────────────────

let _db: ReturnType<InstanceType<typeof DataAPIClient>["db"]> | undefined;

export function getDb(): ReturnType<InstanceType<typeof DataAPIClient>["db"]> {
  if (_db !== undefined) return _db;

  const token = process.env["ASTRA_DB_APPLICATION_TOKEN"];
  const endpoint = process.env["ASTRA_DB_API_ENDPOINT"];

  if (!token) throw new Error("ASTRA_DB_APPLICATION_TOKEN is not configured");
  if (!endpoint) throw new Error("ASTRA_DB_API_ENDPOINT is not configured");
  if (endpoint.includes("YOUR_DB_ID")) {
    throw new Error(
      "ASTRA_DB_API_ENDPOINT is still a placeholder — paste your real endpoint from the Astra dashboard",
    );
  }

  const client = new DataAPIClient(token);
  _db = client.db(endpoint);
  return _db;
}

// ─── Collection accessors ─────────────────────────────────────────────────────

export function booksCollection() {
  return getDb().collection<BookDocument>(COLLECTIONS.BOOKS);
}

export function chunksCollection() {
  return getDb().collection<ChunkDocument>(COLLECTIONS.CHUNKS);
}

export function notesCollection() {
  return getDb().collection<NoteDocument>(COLLECTIONS.NOTES);
}

// ─── One-time collection initialiser ─────────────────────────────────────────
// Call this once on first deploy or from a setup script.

export async function ensureCollections(): Promise<void> {
  const db = getDb();
  const existing = await db.listCollections();
  const names = existing.map((c) => c.name);

  if (!names.includes(COLLECTIONS.BOOKS)) {
    await db.createCollection(COLLECTIONS.BOOKS);
  }

  if (!names.includes(COLLECTIONS.CHUNKS)) {
    // 768 dimensions = Gemini text-embedding-004 default output size
    await db.createCollection(COLLECTIONS.CHUNKS, {
      vector: { dimension: 768, metric: "cosine" },
    });
  }

  if (!names.includes(COLLECTIONS.NOTES)) {
    await db.createCollection(COLLECTIONS.NOTES);
  }
}
