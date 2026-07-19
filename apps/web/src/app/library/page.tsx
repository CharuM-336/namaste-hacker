"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Removed mock book-store
import type { Book, BookWorld } from "@/src/types/book";
import { adaptBookWorldToLegacyBook } from "@/lib/book-adapter";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/library")
      .then((r) => r.json())
      .then((data: BookWorld[]) => {
        setBooks(data.map(adaptBookWorldToLegacyBook));
        setMounted(true);
      })
      .catch((err) => {
        console.error(err);
        setMounted(true);
      });
  }, []);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "var(--parchment)" }}
    >
      {/* Top ink border */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "var(--ink)" }}
      />

      <div
        className="mx-auto max-w-screen-xl px-8 pb-24"
        style={{ paddingTop: "10rem" }}
      >
        {/* Header */}
        <div className="mb-20">
          <p
            className="editorial-caption mb-4"
            style={{ color: "var(--ink-whisper)" }}
          >
            Your collection
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            The Library
          </h1>
          <div
            className="mt-6 h-px w-24"
            style={{ background: "var(--ink)" }}
          />
        </div>

        {/* Empty state */}
        {mounted && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            {/* Empty shelf illustration */}
            <div
              style={{
                width: "320px",
                height: "120px",
                borderBottom: "3px solid var(--ink)",
                borderLeft: "3px solid var(--ink)",
                borderRight: "3px solid var(--ink)",
                borderRadius: "0 0 4px 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
                position: "relative",
              }}
            >
              <p
                className="font-reading italic"
                style={{ color: "var(--ink-whisper)", fontSize: "0.9rem" }}
              >
                Awaiting its first book
              </p>
              {/* Shelf bracket decorations */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-3px",
                  left: "-20px",
                  width: "20px",
                  height: "40px",
                  borderBottom: "3px solid var(--ink)",
                  borderLeft: "3px solid var(--ink)",
                  borderRadius: "0 0 0 4px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-3px",
                  right: "-20px",
                  width: "20px",
                  height: "40px",
                  borderBottom: "3px solid var(--ink)",
                  borderRight: "3px solid var(--ink)",
                  borderRadius: "0 0 4px 0",
                }}
              />
            </div>
            <p
              className="font-reading italic mb-8"
              style={{ color: "var(--ink-ghost)" }}
            >
              Your library is empty.
            </p>
            <Link
              href="/"
              className="btn-engraved"
              style={{ textDecoration: "none" }}
            >
              Add your first book
            </Link>
          </div>
        )}

        {/* Book shelf */}
        {books.length > 0 && (
          <>
            {/* Shelf label */}
            <p
              className="editorial-caption mb-10"
              style={{ color: "var(--ink-whisper)" }}
            >
              {books.length} volume{books.length !== 1 ? "s" : ""} in collection
            </p>

            {/* Books displayed as physical objects */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "3rem 2rem",
                alignItems: "end",
              }}
            >
              {books.map((book, index) => (
                <BookObject key={book.id} book={book} index={index} />
              ))}

              {/* Add another book */}
              <Link
                href="/"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "2/3",
                  border: "1.5px dashed var(--sepia-line)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--ink)";
                  e.currentTarget.style.background = "rgba(28,22,18,0.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--sepia-line)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  className="editorial-caption"
                  style={{ color: "var(--ink-whisper)", textAlign: "center" }}
                >
                  + Add
                  <br />a book
                </span>
              </Link>
            </div>

            {/* Shelf rail */}
            <div
              className="mt-16"
              style={{
                height: "8px",
                background: "var(--parchment-deep)",
                borderTop: "2px solid var(--sepia-line)",
                boxShadow: "0 4px 12px rgba(28,22,18,0.08)",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Physical Book Object ────────────────────────────────────────────────

function BookObject({ book, index }: { book: Book; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/books/${book.id}`}
      className="animate-fade-up"
      style={{
        animationDelay: `${index * 80}ms`,
        display: "block",
        textDecoration: "none",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          transition:
            "transform 0.3s var(--ease-book), box-shadow 0.3s var(--ease-book)",
          transform: hovered ? "translateY(-10px) rotate(-0.5deg)" : "none",
          boxShadow: hovered
            ? "6px 20px 40px rgba(28,22,18,0.22), 14px 30px 60px rgba(28,22,18,0.14)"
            : "3px 8px 20px rgba(28,22,18,0.14), 6px 16px 40px rgba(28,22,18,0.08)",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Book cover */}
        <div
          style={{
            aspectRatio: "2/3",
            background: book.palette.primary,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cover texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(160deg, ${book.palette.secondary}33 0%, transparent 60%)`,
            }}
          />

          {/* Spine shadow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "12px",
              background:
                "linear-gradient(to right, rgba(0,0,0,0.25), transparent)",
            }}
          />

          {/* Top light */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "rgba(255,255,255,0.15)",
            }}
          />

          {/* Book title on cover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "1rem",
            }}
          >
            {/* Palette strip */}
            <div
              style={{
                display: "flex",
                gap: "3px",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  height: "3px",
                  flex: 1,
                  background: book.palette.accent,
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  height: "3px",
                  flex: 1,
                  background: book.palette.secondary,
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  height: "3px",
                  flex: 1,
                  background: book.palette.paper,
                  opacity: 0.4,
                }}
              />
            </div>

            <p
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: book.palette.paper,
                lineHeight: 1.3,
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {book.title}
            </p>
            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "0.6rem",
                color: `${book.palette.paper}99`,
                marginTop: "0.25rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {book.author}
            </p>
          </div>

          {/* Spine glow on hover */}
          {hovered && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: "14px",
                background: `linear-gradient(to right, ${book.palette.accent}66, transparent)`,
                transition: "opacity 0.3s ease",
              }}
            />
          )}
        </div>

        {/* Progress bar at bottom */}
        {book.readingProgress > 0 && (
          <div
            style={{
              height: "2px",
              background: "var(--sepia-pale)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${book.readingProgress}%`,
                background: book.palette.accent,
              }}
            />
          </div>
        )}
      </div>

      {/* Below-book info */}
      <div style={{ marginTop: "0.75rem", paddingLeft: "2px" }}>
        <p
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.7rem",
            color: "var(--ink-ghost)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {book.genre}
        </p>
        {book.readingProgress > 0 && (
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "0.65rem",
              color: "var(--ink-whisper)",
              marginTop: "0.2rem",
            }}
          >
            {book.readingProgress}% read
          </p>
        )}
      </div>
    </Link>
  );
}
