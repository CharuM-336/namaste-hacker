"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Removed mock book-store
import type { Book, BookWorld } from "@/src/types/book";
import { adaptBookWorldToLegacyBook } from "@/lib/book-adapter";

export default function BookLandingPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params["id"] as string | undefined;
  const [book, setBook] = useState<Book | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const id = bookId;
    if (!id) return;

    fetch(`/api/book/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data: BookWorld) => {
        if (!data) {
          router.push("/library");
          return;
        }
        setBook(adaptBookWorldToLegacyBook(data));
      })
      .catch(() => {
        router.push("/library");
      });
    // Stagger the reveal for cinematic effect
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [bookId, router]);

  if (!book) return <BookLoadingScreen />;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: book.palette.paper }}
    >
      {/* Paper grain on book's color */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${book.palette.primary}08 0%, transparent 60%)`,
        }}
      />

      {/* Genre-specific decorative element */}
      <GenreOrnament genre={book.genre} palette={book.palette} />

      {/* Main layout — cover left, identity right */}
      <div
        className="relative z-20 flex min-h-screen"
        style={{ paddingTop: "0" }}
      >
        {/* LEFT — Book cover */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "45%",
            minHeight: "100vh",
            background: book.palette.primary,
            flexShrink: 0,
          }}
        >
          {/* Ambient light on cover */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${book.palette.secondary}22 0%, transparent 50%, rgba(0,0,0,0.15) 100%)`,
            }}
          />

          {/* Cover card */}
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed
                ? "translateY(0) scale(1)"
                : "translateY(40px) scale(0.96)",
              transition:
                "opacity 0.9s var(--ease-book), transform 0.9s var(--ease-book)",
              padding: "4rem",
              position: "relative",
              zIndex: 10,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* The physical book */}
            <div
              style={{
                width: "220px",
                background: book.palette.secondary,
                boxShadow:
                  "8px 16px 40px rgba(0,0,0,0.3), 20px 32px 80px rgba(0,0,0,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Cover texture overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "8px",
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.35), transparent)",
                }}
              />

              <div
                style={{
                  padding: "2.5rem 1.75rem",
                  minHeight: "320px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Top ornament */}
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: `${book.palette.accent}99`,
                  }}
                />

                {/* Title on cover */}
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display), Georgia, serif",
                      fontSize: "1.4rem",
                      fontWeight: 600,
                      color: book.palette.paper,
                      lineHeight: 1.25,
                      textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {book.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontSize: "0.65rem",
                      color: `${book.palette.paper}88`,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {book.author}
                  </p>
                </div>

                {/* Palette strip */}
                <div style={{ display: "flex", gap: "3px" }}>
                  {[
                    book.palette.accent,
                    book.palette.secondary,
                    book.palette.paper,
                  ].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        height: "3px",
                        flex: 1,
                        background: c,
                        opacity: 1 - i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Genre badge */}
            <div
              style={{
                marginTop: "2rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1rem",
                border: `1px solid ${book.palette.accent}44`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: book.palette.accent,
                }}
              >
                {book.genre} · {book.palette.mood}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Book identity */}
        <div
          className="flex flex-col justify-center"
          style={{
            flex: 1,
            padding: "8rem 5rem",
            background: book.palette.paper,
            position: "relative",
          }}
        >
          {/* Back to library */}
          <Link
            href="/library"
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-whisper)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            ← Library
          </Link>

          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "none" : "translateY(24px)",
              transition:
                "opacity 0.8s 0.3s var(--ease-book), transform 0.8s 0.3s var(--ease-book)",
            }}
          >
            {/* Companion intro */}
            <p
              className="editorial-caption mb-6"
              style={{ color: "var(--ink-whisper)" }}
            >
              Your companion:{" "}
              <em
                className="font-reading"
                style={{
                  color: book.palette.accent,
                  letterSpacing: 0,
                  textTransform: "none",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                }}
              >
                {book.companionName}
              </em>
            </p>

            {/* Book title — large */}
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                fontWeight: 400,
                color: "var(--ink)",
                marginBottom: "0.5rem",
              }}
            >
              {book.title}
            </h1>

            {/* Author */}
            <p
              className="font-reading italic"
              style={{
                color: "var(--ink-ghost)",
                fontSize: "1.1rem",
                marginBottom: "2rem",
              }}
            >
              {book.author}
            </p>

            {/* Ink rule */}
            <div
              style={{
                width: "40px",
                height: "2px",
                background: book.palette.accent,
                marginBottom: "2rem",
              }}
            />

            {/* Tagline */}
            <p
              className="font-reading"
              style={{
                fontSize: "1.2rem",
                lineHeight: 1.6,
                color: "var(--ink-faint)",
                maxWidth: "38ch",
                marginBottom: "3rem",
                fontStyle: "italic",
              }}
            >
              &ldquo;{book.tagline}&rdquo;
            </p>

            {/* Reading stats — horizontal strip */}
            <div
              style={{
                display: "flex",
                gap: "0",
                marginBottom: "3.5rem",
                borderTop: "1px solid var(--sepia-line)",
                borderBottom: "1px solid var(--sepia-line)",
                padding: "1.25rem 0",
              }}
            >
              <Stat
                label="Est. Read"
                value={
                  book.stats.estimatedHours > 0
                    ? `${book.stats.estimatedHours}h ${book.stats.estimatedMinutes}m`
                    : `${book.stats.estimatedMinutes}m`
                }
              />
              <StatDivider />
              <Stat
                label="Pages"
                value={book.stats.totalPages.toLocaleString()}
              />
              <StatDivider />
              <Stat label="Depth" value={book.stats.difficulty} />
              <StatDivider />
              <Stat label="Mood" value={book.palette.mood} />
            </div>

            {/* Companion intro text */}
            <p
              className="font-reading"
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "var(--ink-ghost)",
                maxWidth: "42ch",
                marginBottom: "3rem",
              }}
            >
              {book.companionName} will sit beside you as you read — asking
              questions, offering context, and collecting your insights. Not an
              AI. A reader, like you.
            </p>

            {/* Begin Journey CTA */}
            <Link
              href={`/books/${book.id}/read`}
              className="btn-engraved"
              style={{
                background: book.palette.primary,
                display: "inline-flex",
                textDecoration: "none",
              }}
            >
              <span>Begin the Journey</span>
              <span style={{ opacity: 0.5 }}>→</span>
            </Link>

            {/* Notes link */}
            <Link
              href={`/books/${book.id}/notes`}
              style={{
                display: "block",
                marginTop: "1.5rem",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-whisper)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              View your notes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat display ─────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, paddingRight: "1.5rem" }}>
      <p
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-whisper)",
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </p>
      <p
        className="font-reading"
        style={{
          fontSize: "1rem",
          color: "var(--ink)",
          textTransform: "capitalize",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function StatDivider() {
  return (
    <div
      style={{
        width: "1px",
        background: "var(--sepia-line)",
        margin: "0 1.5rem 0 0",
        alignSelf: "stretch",
      }}
    />
  );
}

// ─── Genre ornament ───────────────────────────────────────────────────────

function GenreOrnament({
  genre,
  palette,
}: {
  genre: string;
  palette: Book["palette"];
}) {
  if (genre === "fantasy") {
    return (
      <div
        className="pointer-events-none absolute right-8 top-32 z-10 opacity-10"
        style={{ color: palette.accent, fontSize: "8rem" }}
      >
        ✦
      </div>
    );
  }
  if (genre === "philosophy") {
    return (
      <div
        className="pointer-events-none absolute bottom-16 right-12 z-10 opacity-5"
        style={{
          width: "200px",
          height: "200px",
          border: `1px solid ${palette.primary}`,
          borderRadius: "50%",
          transform: "rotate(15deg)",
        }}
      />
    );
  }
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function BookLoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "var(--parchment)" }}
    >
      <div
        className="font-display text-2xl italic"
        style={{ color: "var(--ink-whisper)" }}
      >
        Opening the book...
      </div>
    </div>
  );
}
