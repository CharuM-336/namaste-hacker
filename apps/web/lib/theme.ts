export const THEME_STORAGE_KEY = "namaste-hacker-theme";

export const THEME_MODES = ["light", "dark", "system"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export const READING_FONT_VARIABLES = {
  default: "var(--font-reading)",
  serif: "var(--font-reading)",
} as const;
