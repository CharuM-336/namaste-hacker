"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { BookDNA, BookWorld } from "@/src/types/book";

export default function BookLandingPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params["id"] as string | undefined;
  const [world, setWorld] = useState<BookWorld | null>(null);
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
        if (!data) { router.push("/library"); return; }
        setWorld(data);
      })
      .catch(() => router.push("/library"));

    const t = setTimeout(() => setRevealed(true), 120);
    return () => clearTimeout(t);
  }, [bookId, router]);

  if (!world) return <BookLoadingScreen />;

  const layout = world.theme?.layoutStyle ?? "minimal";

  return <WorldRenderer world={world} revealed={revealed} layout={layout} />;
}

// ─── Layout Router ────────────────────────────────────────────────────────────

function WorldRenderer({ world, revealed, layout }: { world: BookWorld; revealed: boolean; layout: string }) {
  switch (layout) {
    case "dramatic": return <DramaticLayout world={world} revealed={revealed} />;
    case "archival": return <ArchivalLayout world={world} revealed={revealed} />;
    case "editorial": return <EditorialLayout world={world} revealed={revealed} />;
    case "scientific": return <ScientificLayout world={world} revealed={revealed} />;
    case "philosophical": return <PhilosophicalLayout world={world} revealed={revealed} />;
    default: return <MinimalLayout world={world} revealed={revealed} />;
  }
}

// ─── DRAMATIC (fantasy, fiction) ─────────────────────────────────────────────

function DramaticLayout({ world, revealed }: { world: BookWorld; revealed: boolean }) {
  const p = world.palette;
  const dna = world.dna;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: p.primary }}>
      <ParticleField color={p.accent} />
      <div className="pointer-events-none fixed inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${p.secondary}18 0%, transparent 70%)`, zIndex: 1 }} />

      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 pt-8">
        <Link href="/library" style={{ color: `${p.accent}99`, fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-geist-sans)" }}>← Library</Link>
        <span style={{ color: `${p.paper}30`, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-geist-sans)" }}>{world.metadata.genre}</span>
      </nav>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 text-center" style={{ paddingTop: "6rem" }}>
        {dna?.era && (
          <div className="folio-fade-in mb-6" style={{ color: `${p.accent}88`, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-geist-sans)" }}>{dna.era}</div>
        )}

        <h1 className="font-display" style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 300, lineHeight: 1.0, color: p.paper, letterSpacing: "-0.03em", marginBottom: "1rem", textShadow: `0 0 80px ${p.accent}44`, opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(30px)", transition: "opacity 1.2s ease, transform 1.2s ease" }}>
          {world.title}
        </h1>

        <p className="font-reading" style={{ color: `${p.paper}66`, fontSize: "1.1rem", letterSpacing: "0.08em", marginBottom: "3rem", fontStyle: "italic", opacity: revealed ? 1 : 0, transition: "opacity 1.4s 0.3s ease" }}>
          by {world.author}
        </p>

        {dna?.heroQuote && (
          <blockquote className="font-reading" style={{ maxWidth: "52ch", color: `${p.paper}88`, fontSize: "1.2rem", lineHeight: 1.7, fontStyle: "italic", borderLeft: `2px solid ${p.accent}55`, paddingLeft: "1.5rem", marginBottom: "4rem", textAlign: "left", opacity: revealed ? 1 : 0, transition: "opacity 1.4s 0.5s ease" }}>
            &ldquo;{dna.heroQuote}&rdquo;
          </blockquote>
        )}

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", opacity: revealed ? 1 : 0, transition: "opacity 1.4s 0.7s ease" }}>
          <Link href={`/books/${world.id}/read`} style={{ padding: "0.9rem 2.5rem", background: p.accent, color: p.primary, fontFamily: "var(--font-geist-sans)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontWeight: 600 }}>
            Enter the World
          </Link>
          <Link href="/library" style={{ padding: "0.9rem 2rem", border: `1px solid ${p.accent}44`, color: `${p.paper}88`, fontFamily: "var(--font-geist-sans)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
            Library
          </Link>
        </div>
      </div>

      <div className="relative z-10" style={{ background: p.paper }}>
        {dna && <DNASections world={world} dna={dna} />}
      </div>
    </div>
  );
}

// ─── ARCHIVAL (mystery, thriller) ────────────────────────────────────────────

function ArchivalLayout({ world, revealed }: { world: BookWorld; revealed: boolean }) {
  const p = world.palette;
  const dna = world.dna;

  return (
    <div className="relative min-h-screen" style={{ background: "#f0ebe0" }}>
      <div style={{ height: "4px", background: `linear-gradient(to right, ${p.primary}, ${p.secondary})` }} />

      <nav style={{ padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        <Link href="/library" style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", textDecoration: "none" }}>← Archive</Link>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "0.8rem", color: "rgba(0,0,0,0.3)", fontStyle: "italic" }}>Case File</span>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 3rem" }}>
        <div style={{ marginBottom: "3rem", opacity: revealed ? 1 : 0, transition: "opacity 0.8s ease" }}>
          <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: "0.5rem" }}>
            {world.metadata.genre} · {dna?.era ?? world.metadata.mood}
          </p>
          <div style={{ width: "3rem", height: "2px", background: p.primary }} />
        </div>

        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 1.1, color: p.primary, letterSpacing: "-0.02em", marginBottom: "1rem", opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(20px)", transition: "opacity 1s ease, transform 1s ease" }}>
          {world.title}
        </h1>

        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(0,0,0,0.45)", marginBottom: "3rem", opacity: revealed ? 1 : 0, transition: "opacity 1.2s 0.2s ease" }}>
          {world.author}
        </p>

        <div style={{ borderTop: "1px solid rgba(0,0,0,0.15)", borderBottom: "1px solid rgba(0,0,0,0.15)", padding: "1.5rem 0", marginBottom: "3rem" }}>
          <p className="font-reading" style={{ fontStyle: "italic", color: "rgba(0,0,0,0.6)", fontSize: "1.05rem", lineHeight: 1.7 }}>&ldquo;{world.theme?.tagline}&rdquo;</p>
        </div>

        {dna?.heroQuote && (
          <blockquote style={{ borderLeft: `3px solid ${p.accent}`, paddingLeft: "1.5rem", marginBottom: "3rem", fontFamily: "Georgia, serif", fontStyle: "italic", color: "rgba(0,0,0,0.55)", fontSize: "1.1rem", lineHeight: 1.7 }}>
            {dna.heroQuote}
          </blockquote>
        )}

        <div style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(0,0,0,0.12)", marginBottom: "3rem" }}>
          {[
            { label: "Pages", value: String(world.pages) },
            { label: "Difficulty", value: world.metadata.difficulty },
            { label: "Est. Read", value: `${Math.round(world.metadata.estimatedReadingTime / 60)}h ${world.metadata.estimatedReadingTime % 60}m` },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "1.25rem 1rem", borderRight: i < 2 ? "1px solid rgba(0,0,0,0.12)" : "none" }}>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: "0.3rem" }}>{s.label}</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: p.primary, textTransform: "capitalize" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <Link href={`/books/${world.id}/read`} style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", padding: "0.9rem 2rem", background: p.primary, color: "#f0ebe0", fontFamily: "var(--font-geist-sans)", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none" }}>
          Open the File →
        </Link>
      </div>

      {dna && <DNASections world={world} dna={dna} />}
    </div>
  );
}

// ─── EDITORIAL (history, biography) ──────────────────────────────────────────

function EditorialLayout({ world, revealed }: { world: BookWorld; revealed: boolean }) {
  const p = world.palette;
  const dna = world.dna;

  return (
    <div className="relative min-h-screen" style={{ background: p.paper }}>
      <div style={{ background: p.primary, color: p.paper, padding: "0.75rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/library" style={{ color: `${p.paper}77`, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-geist-sans)" }}>← Library</Link>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-geist-sans)", color: `${p.paper}55` }}>{world.metadata.genre}</span>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", fontFamily: "var(--font-geist-sans)", color: `${p.paper}55` }}>Folio</span>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 4rem 0" }}>
        <div style={{ borderBottom: `3px solid ${p.primary}`, paddingBottom: "2rem", marginBottom: "3rem" }}>
          {dna?.era && <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: p.accent, marginBottom: "0.75rem" }}>{dna.era}</p>}
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(3rem, 7vw, 6.5rem)", fontWeight: 400, lineHeight: 1.0, color: p.primary, letterSpacing: "-0.025em", opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(20px)", transition: "opacity 1s ease, transform 1s ease" }}>
            {world.title}
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem", marginBottom: "5rem" }}>
          <div>
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: `${p.primary}99`, fontSize: "1rem", marginBottom: "1.5rem" }}>by {world.author}</p>
            <p className="font-reading" style={{ fontSize: "1.15rem", lineHeight: 1.8, color: p.primary, marginBottom: "2rem" }}>{world.metadata.summary}</p>
            {dna?.worldDescription && <p className="font-reading" style={{ fontSize: "1rem", lineHeight: 1.75, color: `${p.primary}88` }}>{dna.worldDescription}</p>}
          </div>
          <div style={{ borderLeft: `1px solid ${p.primary}22`, paddingLeft: "2.5rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${p.primary}55`, marginBottom: "0.5rem" }}>Tagline</p>
              <p className="font-reading" style={{ fontStyle: "italic", color: p.accent, fontSize: "1rem", lineHeight: 1.6 }}>&ldquo;{world.theme?.tagline}&rdquo;</p>
            </div>
            {[
              { label: "Est. Read", value: `${Math.round(world.metadata.estimatedReadingTime / 60)}h` },
              { label: "Depth", value: world.metadata.difficulty },
              { label: "Mood", value: world.metadata.mood },
            ].map((s, i) => (
              <div key={i} style={{ borderTop: `1px solid ${p.primary}15`, padding: "0.75rem 0" }}>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: `${p.primary}44`, marginBottom: "0.2rem" }}>{s.label}</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", color: p.primary, textTransform: "capitalize" }}>{s.value}</p>
              </div>
            ))}
            <div style={{ marginTop: "2rem" }}>
              <Link href={`/books/${world.id}/read`} style={{ display: "block", padding: "0.85rem 1.5rem", background: p.primary, color: p.paper, fontFamily: "var(--font-geist-sans)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}>
                Begin Reading
              </Link>
            </div>
          </div>
        </div>
      </div>

      {dna && <DNASections world={world} dna={dna} />}
    </div>
  );
}

// ─── SCIENTIFIC (science, sci-fi) ─────────────────────────────────────────────

function ScientificLayout({ world, revealed }: { world: BookWorld; revealed: boolean }) {
  const p = world.palette;
  const dna = world.dna;

  return (
    <div className="relative min-h-screen" style={{ background: "#0a0a0f", color: p.paper }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${p.accent}55 1px, transparent 1px), linear-gradient(90deg, ${p.accent}55 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <nav style={{ padding: "1.5rem 4rem", display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.accent}22` }}>
        <Link href="/library" style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${p.accent}77`, textDecoration: "none" }}>← Index</Link>
        <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: `${p.paper}33`, letterSpacing: "0.1em" }}>{world.metadata.genre.toUpperCase()}</span>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "5rem 4rem" }}>
        <div style={{ marginBottom: "4rem", opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(20px)", transition: "opacity 1s ease, transform 1s ease" }}>
          <p style={{ fontFamily: "monospace", fontSize: "0.65rem", color: p.accent, letterSpacing: "0.14em", marginBottom: "1rem" }}>
            {`// ${dna?.era ?? world.metadata.genre}`}
          </p>
          <h1 style={{ fontFamily: "var(--font-geist-sans)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, color: p.paper, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            {world.title}
          </h1>
          <p style={{ fontFamily: "monospace", fontSize: "0.85rem", color: `${p.paper}55`, marginTop: "0.75rem" }}>by {world.author}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: `${p.accent}22`, marginBottom: "4rem" }}>
          {[
            { label: "Pages", value: String(world.pages) },
            { label: "Est. Read", value: `${world.metadata.estimatedReadingTime}min` },
            { label: "Complexity", value: world.metadata.difficulty },
            { label: "Mood", value: world.metadata.mood },
            { label: "Genre", value: world.metadata.genre },
            { label: "Era", value: dna?.era ?? "—" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0a0a0f", padding: "1.25rem 1.5rem" }}>
              <p style={{ fontFamily: "monospace", fontSize: "0.6rem", color: p.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{item.label}</p>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "1rem", color: p.paper, textTransform: "capitalize" }}>{item.value}</p>
            </div>
          ))}
        </div>

        <p className="font-reading" style={{ color: `${p.paper}88`, fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "65ch", marginBottom: "3rem" }}>
          {world.metadata.summary}
        </p>

        <Link href={`/books/${world.id}/read`} style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 2rem", background: p.accent, color: "#0a0a0f", fontFamily: "var(--font-geist-sans)", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>
          Initialize Reading →
        </Link>
      </div>

      {dna && <DNASections world={world} dna={dna} dark />}
    </div>
  );
}

// ─── PHILOSOPHICAL ────────────────────────────────────────────────────────────

function PhilosophicalLayout({ world, revealed }: { world: BookWorld; revealed: boolean }) {
  const p = world.palette;
  const dna = world.dna;

  return (
    <div className="relative min-h-screen" style={{ background: p.paper }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, padding: "1.5rem 4rem", display: "flex", justifyContent: "space-between" }}>
        <Link href="/library" style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-whisper)", textDecoration: "none" }}>← Library</Link>
      </nav>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8rem 4rem", textAlign: "center" }}>
        <div style={{ opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(24px)", transition: "opacity 1.4s ease, transform 1.4s ease" }}>
          {dna?.heroQuote ? (
            <blockquote className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", fontWeight: 300, lineHeight: 1.4, color: "var(--ink)", maxWidth: "22ch", margin: "0 auto 3rem", fontStyle: "italic" }}>
              &ldquo;{dna.heroQuote}&rdquo;
            </blockquote>
          ) : (
            <h1 className="font-display" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 300, lineHeight: 1.1, color: "var(--ink)", marginBottom: "2rem" }}>
              {world.title}
            </h1>
          )}
          <div style={{ width: "2rem", height: "1px", background: p.accent, margin: "0 auto 2rem" }} />
          <p className="font-reading" style={{ fontStyle: "italic", color: "var(--ink-ghost)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{world.title}</p>
          <p className="font-reading" style={{ color: "var(--ink-whisper)", fontSize: "0.9rem", marginBottom: "4rem" }}>by {world.author}</p>
          <Link href={`/books/${world.id}/read`} style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: p.accent, textDecoration: "none" }}>
            Begin Reading →
          </Link>
        </div>
      </div>

      {dna && <DNASections world={world} dna={dna} />}
    </div>
  );
}

// ─── MINIMAL (productivity, non-fiction) ─────────────────────────────────────

function MinimalLayout({ world, revealed }: { world: BookWorld; revealed: boolean }) {
  const p = world.palette;
  const dna = world.dna;

  return (
    <div className="relative min-h-screen" style={{ background: p.paper }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "6rem 2rem" }}>
        <Link href="/library" style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-whisper)", textDecoration: "none", display: "block", marginBottom: "6rem" }}>
          ← Library
        </Link>

        <div style={{ marginBottom: "4rem", borderBottom: `1px solid ${p.primary}22`, paddingBottom: "3rem" }}>
          <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: p.accent, marginBottom: "1.5rem" }}>{world.metadata.genre}</p>
          <h1 style={{ fontFamily: "var(--font-geist-sans)", fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 700, lineHeight: 1.08, color: p.primary, letterSpacing: "-0.03em", opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(16px)", transition: "opacity 1s ease, transform 1s ease" }}>
            {world.title}
          </h1>
          <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.9rem", color: `${p.primary}66`, marginTop: "0.75rem" }}>by {world.author}</p>
        </div>

        <p className="font-reading" style={{ fontSize: "1.15rem", lineHeight: 1.75, color: p.primary, marginBottom: "3rem" }}>{world.metadata.summary}</p>

        <div style={{ display: "flex", gap: "3rem", marginBottom: "4rem" }}>
          {[
            { label: "Read time", value: `${Math.round(world.metadata.estimatedReadingTime / 60)}h ${world.metadata.estimatedReadingTime % 60}m` },
            { label: "Difficulty", value: world.metadata.difficulty },
            { label: "Mood", value: world.metadata.mood },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: `${p.primary}44`, marginBottom: "0.3rem" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.95rem", color: p.primary, textTransform: "capitalize" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <Link href={`/books/${world.id}/read`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2rem", background: p.primary, color: p.paper, fontFamily: "var(--font-geist-sans)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", fontWeight: 600 }}>
          Start Reading →
        </Link>
      </div>

      {dna && <DNASections world={world} dna={dna} />}
    </div>
  );
}

// ─── Shared DNA sections ──────────────────────────────────────────────────────

function DNASections({ world, dna, dark = false }: { world: BookWorld; dna: BookDNA; dark?: boolean }) {
  const p = world.palette;
  const textColor = dark ? `${p.paper}88` : "var(--ink-ghost)";
  const headingColor = dark ? p.paper : "var(--ink)";
  const borderColor = dark ? `${p.accent}22` : `${p.primary}12`;
  const bg = dark ? "#0a0a0f" : p.paper;

  return (
    <div style={{ background: bg }}>
      {dna.worldDescription && (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "5rem 3rem", borderTop: `1px solid ${borderColor}` }}>
          <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: p.accent, marginBottom: "1.5rem" }}>The World</p>
          <p className="font-reading" style={{ fontSize: "1.25rem", lineHeight: 1.8, color: headingColor, fontStyle: "italic" }}>{dna.worldDescription}</p>
        </div>
      )}

      {dna.characters.length > 0 && (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 3rem", borderTop: `1px solid ${borderColor}` }}>
          <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: p.accent, marginBottom: "2.5rem" }}>Characters</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {dna.characters.map((char, i) => (
              <div key={i} style={{ padding: "1.75rem", border: `1px solid ${borderColor}`, position: "relative" }}>
                <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", width: "8px", height: "8px", borderRadius: "50%", background: char.importance === "protagonist" ? p.accent : char.importance === "antagonist" ? "#c0392b" : `${p.accent}55` }} />
                <p style={{ fontFamily: dark ? "var(--font-geist-sans)" : "Georgia, serif", fontWeight: 600, fontSize: "1.05rem", color: headingColor, marginBottom: "0.25rem" }}>{char.name}</p>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: p.accent, marginBottom: "0.75rem" }}>{char.role}</p>
                <p className="font-reading" style={{ fontSize: "0.9rem", lineHeight: 1.6, color: textColor }}>{char.personality}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {dna.narrativeSections.length > 0 && (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 3rem", borderTop: `1px solid ${borderColor}` }}>
          {dna.narrativeSections.map((section, i) => (
            <div key={i} style={{ marginBottom: "3rem" }}>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: p.accent, marginBottom: "0.75rem" }}>{section.heading}</p>
              <p className="font-reading" style={{ fontSize: "1.05rem", lineHeight: 1.8, color: textColor }}>{section.body}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 3rem 6rem", borderTop: `1px solid ${borderColor}` }}>
        <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: p.accent, marginBottom: "1.5rem" }}>Your Companion</p>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: world.companion.avatarColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>{world.companion.name[0]}</span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 600, fontSize: "0.9rem", color: headingColor, marginBottom: "0.25rem" }}>{world.companion.name}</p>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: p.accent, marginBottom: "0.75rem" }}>{world.companion.tone}</p>
            <p className="font-reading" style={{ fontSize: "0.95rem", lineHeight: 1.7, color: textColor, fontStyle: "italic" }}>
              &ldquo;{world.companion.greeting}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Particle field ───────────────────────────────────────────────────────────

function ParticleField({ color }: { color: string }) {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 10,
  }));

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 2 }}>
      {particles.map((pt) => (
        <div
          key={pt.id}
          className="folio-particle"
          style={{
            position: "absolute",
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            width: `${pt.size}px`,
            height: `${pt.size}px`,
            borderRadius: "50%",
            background: color,
            opacity: 0.4,
            animationDelay: `${pt.delay}s`,
            animationDuration: `${pt.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function BookLoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ background: "var(--parchment)" }}>
      <div className="font-display text-2xl italic" style={{ color: "var(--ink-whisper)" }}>
        Opening the world&hellip;
      </div>
      <div style={{ width: "120px", height: "2px", background: "var(--sepia-line)", animation: "folio-shimmer 1.5s ease infinite" }} />
    </div>
  );
}
