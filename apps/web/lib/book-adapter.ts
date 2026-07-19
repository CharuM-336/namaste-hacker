import type { Book, BookWorld } from "@/src/types/book";

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
    coverDataUrl: world.cover, // base64
    palette: {
      primary: world.palette.primary,
      secondary: world.palette.secondary,
      accent: world.palette.accent,
      paper: world.palette.paper,
      ink: "#1c1612", // fallback
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
    tagline: world.theme.tagline,
    fileName: `${world.title}.pdf`,
  };
}
