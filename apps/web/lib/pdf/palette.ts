import type { BookGenre, BookPalette } from "@/types/book";

// ─── Genre → palette map ──────────────────────────────────────────────────────
// Deterministic, no AI needed. Each genre gets a distinct, intentional palette.

const GENRE_PALETTES: Record<BookGenre, BookPalette> = {
  fantasy: {
    primary: "#2d1b4e",
    secondary: "#6b3fa0",
    accent: "#c9a84c",
    paper: "#f0ece4",
    shadow: "rgba(45,27,78,0.18)",
  },
  thriller: {
    primary: "#1a1a1a",
    secondary: "#8b0000",
    accent: "#c0c0c0",
    paper: "#f0ede8",
    shadow: "rgba(26,26,26,0.22)",
  },
  mystery: {
    primary: "#1e2a3a",
    secondary: "#4a6fa5",
    accent: "#d4a843",
    paper: "#f2efe8",
    shadow: "rgba(30,42,58,0.18)",
  },
  romance: {
    primary: "#5c1a3a",
    secondary: "#c2415c",
    accent: "#f0b8a8",
    paper: "#fdf5f2",
    shadow: "rgba(92,26,58,0.14)",
  },
  "science-fiction": {
    primary: "#0d1b2a",
    secondary: "#1b4f72",
    accent: "#5dade2",
    paper: "#f0f4f8",
    shadow: "rgba(13,27,42,0.2)",
  },
  philosophy: {
    primary: "#2c3e50",
    secondary: "#7f8c8d",
    accent: "#d4ac0d",
    paper: "#f5f2eb",
    shadow: "rgba(44,62,80,0.14)",
  },
  history: {
    primary: "#5c3d2e",
    secondary: "#a0522d",
    accent: "#b8860b",
    paper: "#f4eedc",
    shadow: "rgba(92,61,46,0.16)",
  },
  science: {
    primary: "#0a2342",
    secondary: "#1a6b9a",
    accent: "#3498db",
    paper: "#f2f4f6",
    shadow: "rgba(10,35,66,0.18)",
  },
  productivity: {
    primary: "#1c3a2e",
    secondary: "#2e7d5e",
    accent: "#f0a500",
    paper: "#f5f3ee",
    shadow: "rgba(28,58,46,0.14)",
  },
  biography: {
    primary: "#2e2e2e",
    secondary: "#5a5a5a",
    accent: "#b8960c",
    paper: "#f8f5f0",
    shadow: "rgba(46,46,46,0.16)",
  },
  fiction: {
    primary: "#2c2c54",
    secondary: "#706fd3",
    accent: "#ff9f43",
    paper: "#f5f0ec",
    shadow: "rgba(44,44,84,0.16)",
  },
  "non-fiction": {
    primary: "#222831",
    secondary: "#393e46",
    accent: "#c4a35a",
    paper: "#f5f2ec",
    shadow: "rgba(34,40,49,0.16)",
  },
  unknown: {
    primary: "#1c1612",
    secondary: "#4a3f35",
    accent: "#c4a05c",
    paper: "#f5f0e8",
    shadow: "rgba(28,22,18,0.14)",
  },
};

export function paletteForGenre(genre: BookGenre): BookPalette {
  return GENRE_PALETTES[genre];
}

// ─── SVG cover generator ──────────────────────────────────────────────────────
// Produces a self-contained inline SVG — no canvas, no native deps.

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title: string, maxCharsPerLine = 16): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + 1 > maxCharsPerLine && current !== "") {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

export function generateSVGCover(
  title: string,
  author: string,
  palette: BookPalette,
): string {
  const lines = wrapTitle(title);
  const lineHeight = 26;
  const blockHeight = lines.length * lineHeight;
  const startY = 145 - blockHeight / 2;

  const titleSVG = lines
    .map(
      (line, i) =>
        `<text x="100" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" font-weight="600" fill="${palette.paper}" paint-order="stroke" stroke="${palette.primary}" stroke-width="0.5">${escapeXml(line)}</text>`,
    )
    .join("\n    ");

  const accentY = startY + blockHeight + 12;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
  <defs>
    <linearGradient id="coverBg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${palette.primary}"/>
      <stop offset="100%" stop-color="${palette.secondary}"/>
    </linearGradient>
    <linearGradient id="spineShadow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(0,0,0,0.28)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="200" height="300" fill="url(#coverBg)"/>

  <!-- Decorative border inset -->
  <rect x="10" y="10" width="180" height="280" fill="none" stroke="${palette.accent}" stroke-width="0.75" opacity="0.35"/>

  <!-- Accent bar top -->
  <rect x="0" y="0" width="200" height="4" fill="${palette.accent}"/>

  <!-- Decorative circle motif -->
  <circle cx="100" cy="148" r="72" fill="none" stroke="${palette.accent}" stroke-width="0.5" opacity="0.18"/>
  <circle cx="100" cy="148" r="55" fill="none" stroke="${palette.accent}" stroke-width="0.5" opacity="0.12"/>

  <!-- Title block -->
  ${titleSVG}

  <!-- Thin rule under title -->
  <line x1="60" y1="${accentY}" x2="140" y2="${accentY}" stroke="${palette.accent}" stroke-width="0.8" opacity="0.7"/>

  <!-- Author -->
  <text x="100" y="278" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="9" letter-spacing="1.5" fill="${palette.paper}" opacity="0.65">${escapeXml(author.toUpperCase())}</text>

  <!-- Spine shadow overlay -->
  <rect x="0" y="0" width="14" height="300" fill="url(#spineShadow)"/>
</svg>`.trim();
}
