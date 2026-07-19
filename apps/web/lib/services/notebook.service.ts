import { notesCollection } from "@/lib/db/astra";
import { Errors, normaliseError } from "@/lib/utils/errors";
import type { BookNote, NoteType, ServiceResult } from "@/types/book";

// ─── Input types ──────────────────────────────────────────────────────────────

export interface CreateNoteInput {
  bookId: string;
  type: NoteType;
  content: string;
  pageRef?: number | undefined;
}

export interface DeleteNoteInput {
  noteId: string;
}

// ─── ID generator ─────────────────────────────────────────────────────────────

function generateNoteId(): string {
  return `nt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Notebook service ─────────────────────────────────────────────────────────

export const notebookService = {
  async getByBook(bookId: string): Promise<ServiceResult<BookNote[]>> {
    try {
      const docs = await notesCollection()
        .find({ bookId }, { sort: { createdAt: -1 }, limit: 200 })
        .toArray();

      const notes: BookNote[] = docs.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id,
      }));

      return { success: true, data: notes };
    } catch (err) {
      return { success: false, error: normaliseError(err) };
    }
  },

  async create(input: CreateNoteInput): Promise<ServiceResult<BookNote>> {
    if (!input.content.trim()) {
      return {
        success: false,
        error: Errors.invalidInput("Note content cannot be empty"),
      };
    }

    if (input.content.length > 2000) {
      return {
        success: false,
        error: Errors.invalidInput("Note content exceeds 2000 characters"),
      };
    }

    const validTypes: NoteType[] = ["quote", "question", "insight"];
    if (!validTypes.includes(input.type)) {
      return {
        success: false,
        error: Errors.invalidInput(`Invalid note type: ${input.type}`),
      };
    }

    const id = generateNoteId();
    const note: BookNote = {
      id,
      bookId: input.bookId,
      type: input.type,
      content: input.content.trim(),
      rotation: parseFloat(((Math.random() - 0.5) * 6).toFixed(2)),
      createdAt: new Date().toISOString(),
      ...(input.pageRef !== undefined && { pageRef: input.pageRef }),
    };

    try {
      await notesCollection().insertOne({ ...note, _id: id });
      return { success: true, data: note };
    } catch (err) {
      return { success: false, error: normaliseError(err) };
    }
  },

  async delete(noteId: string): Promise<ServiceResult<void>> {
    try {
      const result = await notesCollection().deleteOne({ _id: noteId });

      if (!result.deletedCount) {
        return { success: false, error: Errors.notFound("Note") };
      }

      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, error: normaliseError(err) };
    }
  },
} as const;
