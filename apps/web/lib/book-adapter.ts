import type { BookWorld } from "@/src/types/book";

// ─── Legacy Book shape (used by reading and library pages) ────────────────────
// We keep this locally rather than in types/book.ts so the new BookWorld-first
// pages don't need to carry legacy fields.

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverDataUrl: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    paper: string;
    ink: string;
    mood: string;
  };
  companionName: string;
  stats: {
    totalPages: number;
    wordsEstimate: number;
    minutesPerPage: number;
    estimatedHours: number;
    estimatedMinutes: number;
    difficulty: string;
  };
  uploadedAt: string;
  readingProgress: number;
  tagline: string;
  fileName: string;
}

export function adaptBookWorldToLegacyBook(world: BookWorld): Book {
  const readingTimeTotalMinutes =
    world.metadata.estimatedReadingTime || Math.max(world.pages * 2, 10);
  const estimatedHours = Math.floor(readingTimeTotalMinutes / 60);
  const estimatedMinutes = readingTimeTotalMinutes % 60;

  return {
    id: world.id,
    title: world.title,
    author: world.author,
    genre: world.metadata.genre,
    coverDataUrl: world.cover,
    palette: {
      primary: world.palette.primary,
      secondary: world.palette.secondary,
      accent: world.palette.accent,
      paper: world.palette.paper,
      ink: "#1c1612",
      mood: world.metadata.mood,
    },
    companionName: world.companion.name,
    stats: {
      totalPages: world.pages,
      wordsEstimate: world.pages * 250,
      minutesPerPage: 2,
      estimatedHours,
      estimatedMinutes,
      difficulty: world.metadata.difficulty,
    },
    uploadedAt: world.createdAt,
    readingProgress: 0,
    tagline: world.theme?.tagline ?? "",
    fileName: `${world.title}.pdf`,
  };
}
