# Namaste Hacker

Namaste Hacker is a production-grade AI-native reading platform for turning books into interactive, personalized reading experiences.

## Project Vision

Build the reading layer for deeply understanding books: structured book intelligence, adaptive guidance, companion-style exploration, and reader-owned knowledge workflows.

## Goals

- Convert long-form books into interactive reading experiences.
- Support durable book intelligence through Book DNA, annotations, notebooks, and personalized companions.
- Keep the platform scalable, maintainable, and open-source friendly from day one.
- Use strong typing, feature-first architecture, and clean boundaries across application and package layers.

## Architecture Overview

The repository is organized as a monorepo. The first application lives in `apps/web`, while reusable domain packages will live under `packages`.

The web app uses the Next.js App Router and is structured for feature-based development. Future package boundaries will separate AI orchestration, PDF ingestion, reader state, notebook workflows, theme primitives, shared utilities, and UI components.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- shadcn/ui
- Zod

## Repository Structure

```text
apps/
  web/
packages/
  ai/
  pdf/
  reader/
  notebook/
  theme/
  ui/
  shared/
docs/
scripts/
.github/
```

## Development Status

The project is in foundational bootstrap. The current focus is repository architecture, code quality gates, and a stable web application baseline.

## Roadmap

- Establish domain models for books, reading sessions, annotations, and Book DNA.
- Build the interactive reader experience.
- Add notebook and companion workflows.
- Introduce AI orchestration and personalization layers.
- Prepare ingestion pipelines for book formats.

## Contributing

Contribution guidelines will be added as the public development workflow matures.

## License

License details will be finalized before the first public release.
