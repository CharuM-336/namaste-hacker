import { z } from "zod";

export const readingExperienceSchema = z.object({
  bookId: z.string().min(1),
  readerId: z.string().min(1),
  mode: z.enum(["read", "study", "explore"]),
});

export type ReadingExperience = z.infer<typeof readingExperienceSchema>;
