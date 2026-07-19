"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// Removed legacy book-store import

export default function LandingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Please upload a PDF file.");
        return;
      }
      setIsProcessing(true);
      setProcessingText("Reading the pages...");

      try {
        await new Promise((r) => setTimeout(r, 600));
        setProcessingText("Sensing the genre...");
        await new Promise((r) => setTimeout(r, 700));
        setProcessingText("Crafting your world...");

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || "Failed to process book");
        }

        const data = await res.json();

        await new Promise((r) => setTimeout(r, 500));
        router.push(`/books/${data.bookId}`);
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : "An error occurred");
        setIsProcessing(false);
        setProcessingText("");
      }
    },
    [router],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  if (isProcessing) {
    return <ProcessingScreen text={processingText} />;
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--parchment)" }}
    >
      {/* Aged paper vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(28,22,18,0.08) 100%)",
        }}
      />

      {/* Top decorative border */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "var(--ink)" }}
      />

      {/* Floating motes — ambient atmosphere */}
      <Motes />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
        {/* Edition marker */}
        <div
          className="animate-fade-in editorial-caption mb-12"
          style={{ color: "var(--ink-whisper)" }}
        >
          A Reading Companion
        </div>

        {/* Headline — the most important text on the page */}
        <h1
          className="animate-fade-up font-display mb-6 max-w-3xl text-center"
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontWeight: 400,
            color: "var(--ink)",
          }}
        >
          Every book deserves
          <br />
          <em>its own world.</em>
        </h1>

        {/* Ornament */}
        <div
          className="animate-fade-in delay-300 mb-8 flex items-center gap-4"
          style={{ color: "var(--sepia-line)" }}
        >
          <span
            className="h-px w-16"
            style={{ background: "var(--sepia-line)" }}
          />
          <span
            className="font-reading text-sm italic"
            style={{ color: "var(--ink-ghost)" }}
          >
            ✦
          </span>
          <span
            className="h-px w-16"
            style={{ background: "var(--sepia-line)" }}
          />
        </div>

        <p
          className="animate-fade-up delay-200 font-reading mb-16 max-w-md text-center text-lg italic"
          style={{ color: "var(--ink-ghost)", lineHeight: 1.7 }}
        >
          Upload a book and enter its world. Every title gets a handcrafted
          experience built from its pages.
        </p>

        {/* Open-book upload zone */}
        <div
          className="animate-fade-up delay-400 relative w-full max-w-2xl"
          style={{ perspective: "1200px" }}
        >
          <input
            ref={fileInputRef}
            accept=".pdf"
            className="hidden"
            id="book-upload"
            type="file"
            onChange={handleFileChange}
          />

          {/* The book */}
          <button
            className="relative w-full cursor-pointer border-none bg-transparent p-0"
            id="book-drop-zone"
            style={{ outline: "none" }}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <OpenBook isDragging={isDragging} />
          </button>
        </div>

        {/* Instruction */}
        <p
          className="animate-fade-in delay-600 editorial-caption mt-10"
          style={{ color: "var(--ink-whisper)" }}
        >
          Drop a PDF or click the book to open
        </p>

        {/* Sample genres hint */}
        <div
          className="animate-fade-in delay-800 mt-16 flex items-center gap-8"
          style={{ color: "var(--ink-whisper)" }}
        >
          {["Fantasy", "Philosophy", "Thriller", "History", "Science"].map(
            (g) => (
              <span
                key={g}
                className="editorial-caption"
                style={{ fontSize: "0.6rem" }}
              >
                {g}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--sepia-line)" }}
      />
    </div>
  );
}

// ─── Open Book SVG / Visual ───────────────────────────────────────────────

function OpenBook({ isDragging }: { isDragging: boolean }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: "100%",
        maxWidth: "560px",
        transition: "transform 0.3s var(--ease-book)",
        transform: isDragging ? "scale(1.03) translateY(-4px)" : "scale(1)",
      }}
    >
      {/* Book shadow */}
      <div
        className="absolute -bottom-6 left-1/2"
        style={{
          transform: "translateX(-50%)",
          width: "70%",
          height: "30px",
          background: "rgba(28,22,18,0.12)",
          borderRadius: "50%",
          filter: "blur(16px)",
          transition: "all 0.3s ease",
          opacity: isDragging ? 0.5 : 0.8,
        }}
      />

      {/* Book itself — two-page spread */}
      <div
        style={{
          display: "flex",
          width: "100%",
          boxShadow: isDragging
            ? "8px 20px 50px rgba(28,22,18,0.22), 20px 40px 80px rgba(28,22,18,0.14)"
            : "4px 10px 30px rgba(28,22,18,0.14), 10px 20px 60px rgba(28,22,18,0.08)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Left page */}
        <div
          style={{
            flex: 1,
            background: "#faf7f2",
            padding: "3rem 2rem 3rem 2.5rem",
            borderRight: "2px solid rgba(28,22,18,0.1)",
            position: "relative",
            minHeight: "320px",
          }}
        >
          {/* Red margin line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "2.5rem",
              width: "1px",
              background: "rgba(180,30,30,0.15)",
            }}
          />
          {/* Ruled lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "1px",
                background: "rgba(28,22,18,0.06)",
                marginBottom: "1.75rem",
              }}
            />
          ))}
          {/* Left page text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <p
              className="font-reading text-center italic"
              style={{
                color: isDragging ? "var(--ink)" : "var(--ink-whisper)",
                fontSize: "1rem",
                lineHeight: 1.8,
                transition: "color 0.3s ease",
              }}
            >
              {isDragging ? "Release to open this book" : "Place your book"}
              <br />
              <span style={{ fontSize: "0.8rem", color: "var(--ink-whisper)" }}>
                {isDragging ? "✦" : "upon these pages"}
              </span>
            </p>
          </div>
        </div>

        {/* Spine */}
        <div
          style={{
            width: "12px",
            background:
              "linear-gradient(to right, rgba(28,22,18,0.15), rgba(28,22,18,0.05))",
            flexShrink: 0,
          }}
        />

        {/* Right page */}
        <div
          style={{
            flex: 1,
            background: "#faf7f2",
            padding: "3rem 2.5rem 3rem 2rem",
            position: "relative",
            minHeight: "320px",
          }}
        >
          {/* Ruled lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "1px",
                background: "rgba(28,22,18,0.06)",
                marginBottom: "1.75rem",
              }}
            />
          ))}
          {/* Right page content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            {/* Drop icon */}
            <div
              style={{
                width: "48px",
                height: "48px",
                border: `1.5px solid ${isDragging ? "var(--ink)" : "var(--sepia-line)"}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                transition: "all 0.3s ease",
                transform: isDragging ? "scale(1.15)" : "scale(1)",
              }}
            >
              <svg
                fill="none"
                height="20"
                stroke={isDragging ? "var(--ink)" : "var(--ink-ghost)"}
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width="20"
              >
                <path
                  d="M12 16V8m0 8-3-3m3 3 3-3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 16.5v.75A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25v-.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              className="editorial-caption text-center"
              style={{
                color: isDragging ? "var(--gold-accent)" : "var(--ink-ghost)",
                fontSize: "0.65rem",
                transition: "color 0.3s ease",
              }}
            >
              PDF · Any genre
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Processing screen ────────────────────────────────────────────────────

function ProcessingScreen({ text }: { text: string }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "var(--parchment)", zIndex: 100 }}
    >
      {/* Animated ink drop */}
      <div
        className="mb-12"
        style={{
          width: "60px",
          height: "60px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
            background: "var(--ink)",
            animation: "color-bloom 1.2s ease-in-out infinite alternate",
          }}
        />
      </div>

      <p
        className="font-display text-center text-2xl italic"
        style={{ color: "var(--ink)" }}
      >
        {text}
      </p>
      <p
        className="editorial-caption mt-4"
        style={{ color: "var(--ink-whisper)" }}
      >
        Building your world
      </p>
    </div>
  );
}

// ─── Ambient dust motes ───────────────────────────────────────────────────

function Motes() {
  const motes = [
    { x: "15%", y: "20%", size: 3, delay: 0, duration: 8 },
    { x: "80%", y: "15%", size: 2, delay: 2, duration: 11 },
    { x: "60%", y: "70%", size: 4, delay: 1, duration: 9 },
    { x: "30%", y: "80%", size: 2, delay: 3, duration: 13 },
    { x: "90%", y: "60%", size: 3, delay: 1.5, duration: 10 },
    { x: "10%", y: "55%", size: 2, delay: 0.5, duration: 12 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: m.x,
            top: m.y,
            width: `${m.size}px`,
            height: `${m.size}px`,
            borderRadius: "50%",
            background: "var(--sepia-line)",
            opacity: 0.4,
            animation: `float-particle ${m.duration}s ${m.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
