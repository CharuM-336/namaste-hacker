import Link from "next/link";

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <EditorialNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-sepia-line/40 py-8">
        <div
          className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-8"
          style={{ borderColor: "var(--sepia-line)" }}
        >
          <span
            className="font-display text-sm italic"
            style={{ color: "var(--ink-whisper)" }}
          >
            Folio
          </span>
          <span
            className="editorial-caption"
            style={{ color: "var(--ink-whisper)" }}
          >
            Every book deserves its own world
          </span>
        </div>
      </footer>
    </div>
  );
}

function EditorialNav() {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 py-6 px-8"
      style={{ mixBlendMode: "multiply" }}
    >
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-2xl italic transition-opacity hover:opacity-70"
          style={{ color: "var(--ink)", textDecoration: "none" }}
        >
          Folio
        </Link>

        {/* Navigation — pure text, no icons */}
        <nav className="flex items-center gap-10">
          <Link
            href="/library"
            className="editorial-caption transition-all hover:opacity-60"
            style={{ color: "var(--ink)", textDecoration: "none" }}
          >
            Library
          </Link>
          <Link
            href="/"
            className="editorial-caption transition-all hover:opacity-60"
            style={{ color: "var(--ink)", textDecoration: "none" }}
          >
            Upload
          </Link>
        </nav>
      </div>
    </header>
  );
}
