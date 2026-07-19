// --- Genre -------------------------------------------------------------------

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
  | "dramatic"
  | "archival"
  | "editorial"
  | "scientific"
  | "philosophical"
  | "minimal";

export type MotionStyle = "fluid" | "sharp" | "gentle" | "cinematic";

export type AnimationStyle =
  | "particle"
  | "fog"
  | "geometric"
  | "ink"
  | "minimal"
  | "cosmic";

export type CompanionTone =
  | "warm"
  | "scholarly"
  | "poetic"
  | "analytical"
  | "philosophical"
  | "playful";

export type NoteType = "quote" | "question" | "insight";

// --- Core models -------------------------------------------------------------

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

// --- BookDNA -----------------------------------------------------------------

export interface BookCharacter {
  name: string;
  role: string;
  importance: "protagonist" | "antagonist" | "supporting" | "mentor";
  personality: string;
  relationship: string;
}

export interface NarrativeSection {
  heading: string;
  body: string;
}

export interface BookDNA {
  setting: string;
  era: string;
  atmosphere: string;
  emotionalArc: string;
  animationStyle: AnimationStyle;
  decorativeElements: string[];
  characters: BookCharacter[];
  worldDescription: string;
  heroQuote: string;
  narrativeSections: NarrativeSection[];
  iconography: string;
  soundtrackMood: string;
}

// --- BookWorld ----------------------------------------------------------------

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
  dna?: BookDNA;
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

// --- Vector chunk -------------------------------------------------------------

export interface BookChunk {
  bookId: string;
  content: string;
  chunkIndex: number;
  pageRef: number;
}

// --- API response types -------------------------------------------------------

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

// ─── Error types ─────────────────────────────────────────────────────────────

export type ErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "PDF_PARSE_FAILED"
  | "AI_UNAVAILABLE"
  | "DB_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface AppError {
  code: ErrorCode;
  message: string;
  status: number;
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

// --- Parsed PDF output --------------------------------------------------------

export interface ParsedPDF {
  title: string;
  author: string;
  pages: number;
  pageTexts: string[];
  fullText: string;
}
