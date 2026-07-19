import type { BookPalette } from "@/types/book";

// --- Prompt builders ---------------------------------------------------------
// All prompts instruct the model to return STRICT JSON -- no prose, no markdown.

export const METADATA_PROMPT = (
  title: string,
  author: string,
  sampleText: string,
): string =>
  `
You are a literary analysis engine. Analyse this book and return ONLY a valid JSON object -- no explanation, no markdown, no extra text.

Book: "${title}" by ${author}
Opening text:
"""
${sampleText.slice(0, 2500)}
"""

Return exactly this JSON shape:
{
  "genre": "<one of: fantasy|thriller|mystery|romance|science-fiction|philosophy|history|science|productivity|biography|fiction|non-fiction|unknown>",
  "mood": "<one evocative word describing the book's emotional atmosphere>",
  "difficulty": "<one of: light|moderate|dense>",
  "summary": "<2-3 sentence description of what this book is about>",
  "keywords": ["<5-8 thematic keywords>"],
  "estimatedReadingTime": <integer: total minutes to read at 250 wpm>
}
`.trim();

export const THEME_PROMPT = (
  title: string,
  genre: string,
  mood: string,
  palette: BookPalette,
): string =>
  `
You are a visual identity designer specialising in editorial design and book experiences.

Design a complete visual theme for this book's reading interface.

Book: "${title}"
Genre: ${genre}
Mood: ${mood}
Dominant palette (hex): primary=${palette.primary}, secondary=${palette.secondary}, accent=${palette.accent}, paper=${palette.paper}

Return ONLY valid JSON with no extra text:
{
  "headingFont": "<one of: serif|sans-serif>",
  "bodyFont": "<one of: serif|sans-serif>",
  "layoutStyle": "<one of: dramatic|archival|editorial|scientific|philosophical|minimal>",
  "motionStyle": "<one of: fluid|sharp|gentle|cinematic>",
  "tagline": "<one evocative sentence -- the book's essence in fewer than 12 words>"
}
`.trim();

export const COMPANION_PROMPT = (
  title: string,
  genre: string,
  mood: string,
): string =>
  `
You are creating a reading companion character for an immersive book app.
This character must feel like a real, thoughtful reading mentor -- never like an AI assistant.
They have read everything and carry the spirit of the book.

Book: "${title}"
Genre: ${genre}
Mood: ${mood}

Return ONLY valid JSON with no extra text:
{
  "name": "<a culturally resonant first name that fits the genre>",
  "tone": "<one of: warm|scholarly|poetic|analytical|philosophical|playful>",
  "personality": "<two sentences: their character and their reading philosophy>",
  "greeting": "<their very first message to the reader -- 1-2 sentences, personal, never robotic, never mentions AI>",
  "style": "<how they communicate, e.g. 'speaks in layered questions', 'offers brief vivid comparisons', 'cites passages quietly'>",
  "avatarColor": "<a hex colour that embodies their personality>"
}
`.trim();

// --- BookDNA prompt -----------------------------------------------------------
// Generates the complete immersive world data from the book's content.

export const BOOK_DNA_PROMPT = (
  title: string,
  author: string,
  genre: string,
  mood: string,
  sampleText: string,
): string =>
  `
You are a world-building AI and literary analyst. Your task is to generate the complete immersive "DNA" of a book -- the data that will be used to render a unique, cinematic, award-winning reading experience for it.

Book: "${title}" by ${author}
Genre: ${genre}
Mood: ${mood}
Opening text:
"""
${sampleText.slice(0, 3000)}
"""

Based on this, return ONLY a valid JSON object. No markdown, no explanation, no extra text.

{
  "setting": "<2-sentence vivid description of the physical world -- specific place names, time of day, weather, architecture>",
  "era": "<Historical or fictional era, e.g. 'Victorian England, 1888' or 'Far future, post-collapse Earth'>",
  "atmosphere": "<The emotional and sensory texture in 5-8 words, e.g. 'Dark, damp, intellectually charged, gaslit'>",
  "emotionalArc": "<The reader's emotional journey, e.g. 'Curiosity ? dread ? revelation ? catharsis'>",
  "animationStyle": "<one of: particle|fog|geometric|ink|minimal|cosmic -- choose based on genre and atmosphere>",
  "decorativeElements": ["<3-5 thematic icons or motifs as simple nouns, e.g. 'magnifying-glass', 'ink-quill', 'pocket-watch'>"],
  "characters": [
    {
      "name": "<character full name>",
      "role": "<their role in the story in 4-8 words>",
      "importance": "<one of: protagonist|antagonist|supporting|mentor>",
      "personality": "<2 vivid adjectives and one defining trait>",
      "relationship": "<one sentence about their relationship to the story or protagonist>"
    }
  ],
  "worldDescription": "<A vivid, literary 2-3 sentence paragraph describing the book's world as if narrating the opening scene of a film. Make it cinematic and evocative.>",
  "heroQuote": "<The single most cinematic, memorable sentence from the opening text. If none is memorable, craft one that captures the book's essence in fewer than 20 words.>",
  "narrativeSections": [
    { "heading": "The World", "body": "<2-sentence evocative description of the setting and its rules>" },
    { "heading": "The Journey", "body": "<2-sentence description of the protagonist's path>" },
    { "heading": "The Heart of the Story", "body": "<2-sentence description of the central conflict or question>" },
    { "heading": "What Makes This Unique", "body": "<2-sentence description of what distinguishes this book>" }
  ],
  "iconography": "<A short phrase describing the visual symbols of this book, e.g. 'detective tools, gaslit streets, cipher codes'>",
  "soundtrackMood": "<A short phrase describing the musical feeling, e.g. 'orchestral tension, minor key strings, Victorian chamber music'>"
}

IMPORTANT: The "characters" array must have at minimum 1 and at most 5 entries. Use only characters clearly present in the provided text.
`.trim();

export const EXPLAIN_PROMPT = (
  text: string,
  surroundingContext: string,
): string =>
  `
You are a literary scholar. A reader has highlighted this text while reading.

Highlighted text: "${text}"
Surrounding context: "${surroundingContext}"

Explain it for a thoughtful reader -- be illuminating, not academic.
Return ONLY valid JSON:
{
  "explanation": "<clear, engaging explanation in 2-3 sentences>",
  "type": "<one of: word|phrase|concept>",
  "examples": ["<1-2 examples, analogies, or related usages>"]
}
`.trim();

export const PAGE_QA_PROMPT = (
  question: string,
  relevantChunks: string[],
  companion?: { name: string; tone: string; personality: string; style: string }
): string =>
  `
You are a reading companion answering a reader's question.
Answer using ONLY the provided passages -- do not invent information.

${companion ? `
Your persona:
Name: ${companion.name}
Tone: ${companion.tone}
Personality: ${companion.personality}
Style: ${companion.style}
Adopt this persona completely in your answer. Do not break character. Do not mention that you are an AI.
` : ""}

Question: "${question}"

Relevant passages from the book:
${relevantChunks.map((c, i) => `[${i + 1}] ${c}`).join("\n\n")}

Return ONLY valid JSON:
{
  "answer": "<direct, grounded answer in 2-4 sentences based on the passages>",
  "confidence": "<one of: high|medium|low -- based on how directly the passages address the question>",
  "sources": ["<brief direct quote or reference from each passage used>"]
}
`.trim();
