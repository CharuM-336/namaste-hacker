"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Removed legacy book-store
import type { BookNote, BookWorld } from "@/src/types/book";
import { type Book, adaptBookWorldToLegacyBook } from "@/lib/book-adapter";

export default function NotesPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params["id"] as string | undefined;
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<BookNote[]>([]);
  const [addingNote, setAddingNote] = useState<
    "quote" | "question" | "insight" | null
  >(null);
  const [newContent, setNewContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addNoteRotation = `${(bookId?.length ?? 0) % 2 === 0 ? -0.75 : 0.75}deg`;

  useEffect(() => {
    const id = bookId;
    if (!id) return;

    Promise.all([
      fetch(`/api/book/${id}`).then((r) => r.json()),
      fetch(`/api/notebook?bookId=${id}`).then((r) => r.json()),
    ])
      .then(([bookData, notesData]: [BookWorld, { notes: BookNote[] }]) => {
        if (!bookData) {
          router.push("/library");
          return;
        }
        setBook(adaptBookWorldToLegacyBook(bookData));
        setNotes(notesData.notes || []);
      })
      .catch(() => router.push("/library"));
  }, [bookId, router]);

  const handleAddNote = async () => {
    if (!newContent.trim() || !book || !addingNote) return;

    const res = await fetch("/api/notebook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: book.id,
        type: addingNote,
        content: newContent.trim(),
      }),
    });

    if (res.ok) {
      const data = await fetch(`/api/notebook?bookId=${book.id}`).then((r) =>
        r.json(),
      );
      setNotes(data.notes || []);
      setNewContent("");
      setAddingNote(null);
    }
  };

  const handleDelete = async (noteId: string) => {
    const res = await fetch("/api/notebook", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });
    if (res.ok && book) {
      const data = await fetch(`/api/notebook?bookId=${book.id}`).then((r) =>
        r.json(),
      );
      setNotes(data.notes || []);
    }
  };

  useEffect(() => {
    if (addingNote && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [addingNote]);

  if (!book) return null;

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "var(--parchment-warm)" }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "var(--ink)" }}
      />

      <div
        className="mx-auto max-w-screen-xl px-8 pb-24"
        style={{ paddingTop: "8rem" }}
      >
        {/* Header */}
        <div className="mb-16 flex items-start justify-between">
          <div>
            <Link
              href={`/books/${book.id}`}
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-whisper)",
                textDecoration: "none",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              ← {book.title}
            </Link>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                fontWeight: 400,
                color: "var(--ink)",
              }}
            >
              The Scrapbook
            </h1>
            <p
              className="font-reading italic mt-2"
              style={{ color: "var(--ink-ghost)", fontSize: "0.95rem" }}
            >
              Collected while reading {book.title}
            </p>
          </div>

          {/* Add note buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              marginTop: "2rem",
            }}
          >
            {(["quote", "question", "insight"] as const).map((type) => (
              <button
                key={type}
                className="btn-ghost-ink"
                style={{ fontSize: "0.65rem" }}
                onClick={() => setAddingNote(type === addingNote ? null : type)}
              >
                + {type}
              </button>
            ))}
          </div>
        </div>

        {/* Add note form */}
        {addingNote && (
          <div
            className="animate-fade-up mb-12"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--sepia-line)",
              padding: "2rem",
              maxWidth: "480px",
              transform: `rotate(${addNoteRotation})`,
              boxShadow: "var(--shadow-page)",
              position: "relative",
            }}
          >
            {/* Paper lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 27px,
                  rgba(28,22,18,0.05) 27px,
                  rgba(28,22,18,0.05) 28px
                )`,
              }}
            />

            <p
              className="editorial-caption mb-3"
              style={{
                color: NOTE_COLORS[addingNote],
                position: "relative",
                zIndex: 1,
              }}
            >
              {NOTE_LABELS[addingNote]}
            </p>
            <textarea
              ref={textareaRef}
              placeholder={NOTE_PLACEHOLDERS[addingNote]}
              rows={4}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                outline: "none",
                fontFamily:
                  addingNote === "quote"
                    ? "var(--font-display), Georgia, serif"
                    : "var(--font-reading), Georgia, serif",
                fontSize: addingNote === "quote" ? "1.1rem" : "0.95rem",
                fontStyle: addingNote === "insight" ? "italic" : "normal",
                color: "var(--ink)",
                lineHeight: 1.7,
                resize: "none",
                position: "relative",
                zIndex: 1,
              }}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                  handleAddNote();
                if (e.key === "Escape") setAddingNote(null);
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              <button
                className="btn-engraved"
                style={{ fontSize: "0.6rem", padding: "0.5rem 1.25rem" }}
                onClick={handleAddNote}
              >
                Pin it
              </button>
              <button
                className="editorial-caption"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ink-whisper)",
                }}
                onClick={() => setAddingNote(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {notes.length === 0 && !addingNote && (
          <div style={{ paddingTop: "4rem", textAlign: "center" }}>
            <p
              className="font-reading italic"
              style={{
                color: "var(--ink-whisper)",
                fontSize: "1.1rem",
                marginBottom: "2rem",
              }}
            >
              Nothing collected yet.
            </p>
            <p
              className="editorial-caption"
              style={{ color: "var(--ink-whisper)" }}
            >
              As you read, your quotes, questions, and insights will gather here
              — like a scrapbook built over time.
            </p>
          </div>
        )}

        {/* Scrapbook cards — overlapping, rotated */}
        {notes.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2.5rem",
              alignItems: "start",
            }}
          >
            {notes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────

const NOTE_COLORS = {
  quote: "var(--gold-accent)",
  question: "var(--ink-ghost)",
  insight: "var(--ink-ghost)",
};

const NOTE_LABELS = {
  quote: "Saved quote",
  question: "Open question",
  insight: "An insight",
};

const NOTE_PLACEHOLDERS = {
  quote: "A sentence that stopped you...",
  question: "Something you want to understand...",
  insight: "A connection, a feeling, a hunch...",
};

const NOTE_BG = {
  quote: "#fdfaf4",
  question: "#f9f6f0",
  insight: "#f7f4f0",
};

function NoteCard({
  note,
  index,
  onDelete,
}: {
  note: BookNote;
  index: number;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const baseRotation = note.rotation;
  const rotation = hovered ? 0 : baseRotation;

  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${index * 60}ms`,
        position: "relative",
        transition:
          "transform 0.25s var(--ease-book), box-shadow 0.25s var(--ease-book)",
        transform: `rotate(${rotation}deg) translateY(${hovered ? "-6px" : "0"})`,
        boxShadow: hovered
          ? "6px 16px 40px rgba(28,22,18,0.15)"
          : "3px 6px 16px rgba(28,22,18,0.08)",
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Paper card */}
      <div
        style={{
          background: NOTE_BG[note.type] ?? "#fdfaf4",
          padding: note.type === "quote" ? "2rem 1.75rem" : "1.5rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ruled lines for quote cards */}
        {note.type === "quote" && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "2.25rem",
                width: "1px",
                background: "rgba(180,30,30,0.15)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 27px,
                  rgba(28,22,18,0.05) 27px,
                  rgba(28,22,18,0.05) 28px
                )`,
                pointerEvents: "none",
              }}
            />
          </>
        )}

        {/* Type label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            className="editorial-caption"
            style={{
              color: NOTE_COLORS[note.type],
              fontSize: "0.6rem",
            }}
          >
            {NOTE_LABELS[note.type]}
          </p>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-whisper)",
              fontSize: "0.75rem",
              padding: 0,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.15s ease",
            }}
            onClick={onDelete}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {note.type === "quote" ? (
            <p
              className="font-display"
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.5,
                color: "var(--ink)",
                fontStyle: "italic",
              }}
            >
              &ldquo;{note.content}&rdquo;
            </p>
          ) : note.type === "question" ? (
            <p
              className="font-reading"
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "var(--ink-faint)",
              }}
            >
              {note.content}
            </p>
          ) : (
            <p
              className="font-reading italic"
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "var(--ink-faint)",
              }}
            >
              {note.content}
            </p>
          )}
        </div>

        {/* Date */}
        <p
          className="editorial-caption"
          style={{
            marginTop: "1.25rem",
            color: "var(--ink-whisper)",
            fontSize: "0.55rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>

        {/* Tape effect for insight cards */}
        {note.type === "insight" && (
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%) rotate(-2deg)",
              width: "60px",
              height: "20px",
              background: "rgba(196,160,92,0.25)",
              borderRadius: "1px",
            }}
          />
        )}
      </div>
    </div>
  );
}
