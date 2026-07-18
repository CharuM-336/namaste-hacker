const readingLayers = [
  "Book DNA",
  "Adaptive Reader",
  "Notebook",
  "Companion",
] as const;

const platformPrinciples = [
  "Structured understanding before chat",
  "Reader-owned context and notes",
  "Feature-first product architecture",
  "Typed boundaries for every domain",
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-stone-300/70 pb-5 text-sm dark:border-stone-700">
          <span className="font-semibold tracking-[0.18em] uppercase">
            Namaste Hacker
          </span>
          <span className="text-stone-600 dark:text-stone-300">
            AI-native reading platform
          </span>
        </header>

        <div className="grid gap-12 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Foundational build
            </p>
            <h1 className="text-4xl leading-tight font-semibold text-balance sm:text-6xl">
              Books that become structured, personal, interactive knowledge.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 dark:text-stone-300">
              A production-grade foundation for transforming reading from a
              static document workflow into an adaptive experience shaped by
              book intelligence, reader intent, notes, and companion guidance.
            </p>
          </div>

          <div className="border border-stone-300 bg-white/65 p-5 shadow-sm dark:border-stone-700 dark:bg-stone-950/45">
            <h2 className="text-sm font-semibold tracking-[0.16em] text-stone-500 uppercase dark:text-stone-400">
              Platform layers
            </h2>
            <ul className="mt-5 grid gap-3">
              {readingLayers.map((layer) => (
                <li
                  className="flex items-center justify-between border-b border-stone-200 pb-3 text-base last:border-b-0 last:pb-0 dark:border-stone-800"
                  key={layer}
                >
                  <span>{layer}</span>
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    planned
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="grid gap-3 border-t border-stone-300/70 pt-5 text-sm text-stone-700 sm:grid-cols-2 lg:grid-cols-4 dark:border-stone-700 dark:text-stone-300">
          {platformPrinciples.map((principle) => (
            <span key={principle}>{principle}</span>
          ))}
        </footer>
      </section>
    </main>
  );
}
