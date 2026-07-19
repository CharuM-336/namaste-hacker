// ─── Genre ───────────────────────────────────────────────────────────────────

export type BookGenre =
  | "fantasy"
  | "thriller"
  | "mystery"
  | "romance"
  | "science-fiction"
  | "philosophy"
  | "history"
  | "science"
  | "productivity"
  | "biography"
  | "fiction"
  | "non-fiction"
  | "unknown";

export type BookDifficulty = "light" | "moderate" | "dense";

export type LayoutStyle =
  "editorial" | "minimal" | "dramatic" | "archival" | "scientific";

export type MotionStyle = "fluid" | "sharp" | "gentle" | "cinematic";

export type CompanionTone =
  "warm" | "scholarly" | "poetic" | "analytical" | "philosophical" | "playful";

export type NoteType = "quote" | "question" | "insight";

// ─── Core models ─────────────────────────────────────────────────────────────

export interface BookPalette {
  primary: string;
  secondary: string;
  accent: string;
  paper: string;
  shadow: string;
}

export interface BookTheme {
  primary: string;
  secondary: string;
  accent: string;
  paper: string;
  shadow: string;
  headingFont: string;
  bodyFont: string;
  layoutStyle: LayoutStyle;
  motionStyle: MotionStyle;
  tagline: string;
}

export interface BookCompanion {
  name: string;
  tone: CompanionTone;
  personality: string;
  greeting: string;
  style: string;
  avatarColor: string;
}

export interface BookMetadata {
  genre: BookGenre;
  mood: string;
  difficulty: BookDifficulty;
  summary: string;
  keywords: string[];
  estimatedReadingTime: number;
}

export interface BookWorld {
  id: string;
  title: string;
  author: string;
  pages: number;
  cover: string;
  palette: BookPalette;
  theme: BookTheme;
  companion: BookCompanion;
  metadata: BookMetadata;
  createdAt: string;
}

export interface BookNote {
  id: string;
  bookId: string;
  type: NoteType;
  content: string;
  pageRef?: number;
  rotation: number;
  createdAt: string;
}

// ─── Vector chunk ─────────────────────────────────────────────────────────────

export interface BookChunk {
  bookId: string;
  content: string;
  chunkIndex: number;
  pageRef: number;
}

// ─── API response types ───────────────────────────────────────────────────────

export interface UploadResult {
  bookId: string;
}

export interface ExplainResult {
  explanation: string;
  type: "word" | "phrase" | "concept";
  examples: string[];
}

export interface AskResult {
  answer: string;
  confidence: "high" | "medium" | "low";
  sources: string[];
}

export interface NotebookResult {
  note: BookNote;
}

// ─── Parsed PDF ───────────────────────────────────────────────────────────────

export interface ParsedPDF {
  title: string;
  author: string;
  pages: number;
  fullText: string;
  firstPageText: string;
  pageTexts: string[];
}

// ─── Service result wrapper ───────────────────────────────────────────────────

export type ServiceResult<T> =
  { success: true; data: T } | { success: false; error: AppError };

export interface AppError {
  code: ErrorCode;
  message: string;
  status: number;
}

export type ErrorCode =
  | "INVALID_INPUT"
  | "PDF_PARSE_FAILED"
  | "AI_UNAVAILABLE"
  | "DB_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

// ─── Legacy frontend types (kept for backwards compatibility) ─────────────────

/** @deprecated Use BookWorld from the backend. This stays for the client-side localStorage layer. */
export interface BookLegacyPalette {
  primary: string;
  secondary: string;
  accent: string;
  paper: string;
  ink: string;
  mood: string;
}

/** @deprecated Use BookWorld from the backend. */
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: BookGenre;
  coverDataUrl?: string;
  palette: BookLegacyPalette;
  companionName: string;
  stats: {
    totalPages: number;
    wordsEstimate: number;
    minutesPerPage: number;
    estimatedHours: number;
    estimatedMinutes: number;
    difficulty: BookDifficulty;
  };
  uploadedAt: string;
  lastOpenedAt?: string;
  readingProgress: number;
  tagline: string;
  pdfDataUrl?: string;
  fileName: string;
}
