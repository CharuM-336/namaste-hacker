"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Removed legacy book-store
import type { Book, BookWorld } from "@/src/types/book";
import { adaptBookWorldToLegacyBook } from "@/lib/book-adapter";

export default function ReadingPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params["id"] as string | undefined;
  const [book, setBook] = useState<Book | null>(null);
  const [bookContent, setBookContent] = useState<string[]>([]);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordPos, setWordPos] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<
    { role: "companion" | "reader"; text: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = bookId;
    if (!id) return;

    fetch(`/api/book/${id}`)
      .then((r) => r.json())
      .then((data: BookWorld) => {
        if (!data) {
          router.push("/library");
          return;
        }
        setBook(adaptBookWorldToLegacyBook(data));

        // Fetch actual book content
        fetch(`/api/book/${id}/content`)
          .then((r) => r.json())
          .then((contentData) => {
            if (contentData && Array.isArray(contentData)) {
              setBookContent(contentData);
            }
          })
          .catch(console.error);

        // Companion greeting
        setTimeout(() => {
          setMessages([
            {
              role: "companion",
              text: data.companion.greeting,
            },
          ]);
        }, 2000);
      })
      .catch(() => router.push("/library"));
  }, [bookId, router]);

  const handleWordClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
      setSelectedWord(word);
      setWordPos({ x: e.clientX, y: e.clientY });
    },
    [],
  );

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || !book) return;
    const userMsg = inputText.trim();
    setMessages((prev) => [...prev, { role: "reader", text: userMsg }]);
    setInputText("");

    // Set temporary typing indicator
    setMessages((prev) => [...prev, { role: "companion", text: "..." }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          question: userMsg,
          pageContent: bookContent.slice(0, 3).join("\n"), // Pass first few chunks for local context
        }),
      });
      const data = await res.json();
      setMessages((prev) => {
        const newMsg = [...prev];
        newMsg.pop(); // remove typing indicator
        newMsg.push({
          role: "companion",
          text: data.answer || "I am thinking...",
        });
        return newMsg;
      });
    } catch (_err) {
      setMessages((prev) => {
        const newMsg = [...prev];
        newMsg.pop();
        newMsg.push({
          role: "companion",
          text: "I'm having trouble thinking right now.",
        });
        return newMsg;
      });
    }
  }, [inputText, book, bookContent]);

  const handleSaveQuote = useCallback(
    async (quote: string) => {
      if (!book) return;
      await fetch("/api/notebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          type: "quote",
          content: quote,
        }),
      });
    },
    [book],
  );

  if (!book) return null;

  // Use the fetched content, or fallback to a loading message if not ready
  const readingText = bookContent.length > 0 ? bookContent : ["Loading book content..."];

  return (
    <div
      className="relative min-h-screen"
      style={{ background: book.palette.paper ?? "var(--parchment)" }}
    >
      {/* Paper texture */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 31px,
              rgba(28,22,18,0.025) 31px,
              rgba(28,22,18,0.025) 32px
            )
          `,
          zIndex: 1,
        }}
      />

      {/* Minimal reading nav */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: `${book.palette.paper ?? "var(--parchment)"}ee`,
          borderBottom: "1px solid var(--sepia-line)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Link
          href={`/books/${book.id}`}
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-whisper)",
            textDecoration: "none",
          }}
        >
          ← {book.title}
        </Link>

        <p
          className="font-display italic"
          style={{ color: "var(--ink-ghost)", fontSize: "0.9rem" }}
        >
          {book.title}
        </p>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            href={`/books/${book.id}/notes`}
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-whisper)",
              textDecoration: "none",
            }}
          >
            Notes
          </Link>
        </div>
      </div>

      {/* Reading content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto"
        style={{
          maxWidth: "65ch",
          padding: "8rem 2rem 10rem",
        }}
      >
        {/* Chapter header */}
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
          <p
            className="editorial-caption"
            style={{ color: "var(--ink-whisper)", marginBottom: "0.75rem" }}
          >
            Chapter One
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "2.5rem",
              fontWeight: 400,
              color: "var(--ink)",
              lineHeight: 1.1,
            }}
          >
            {book.title}
          </h2>
          <div
            style={{
              width: "32px",
              height: "2px",
              background: book.palette.accent ?? "var(--gold-accent)",
              margin: "1.5rem auto 0",
            }}
          />
        </div>

        <div
          className="reading-prose"
          style={{
            fontFamily: "var(--font-reading), Georgia, serif",
            fontSize: "1.125rem",
            lineHeight: 1.85,
            color: "var(--ink-faint)",
            whiteSpace: "pre-wrap",
          }}
        >
          {readingText.map((chunk, ci) => (
            <p key={ci} style={{ marginBottom: "2em" }}>
              {chunk.split(" ").map((word, wi) => (
                <InteractiveWord
                  key={`${ci}-${wi}`}
                  word={word}
                  onClick={(e) => handleWordClick(e, word)}
                />
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* Word popover */}
      {selectedWord && (
        <WordPopover
          word={selectedWord}
          pos={wordPos}
          bookId={book.id}
          onClose={() => setSelectedWord(null)}
          onSave={() => {
            handleSaveQuote(selectedWord);
            setSelectedWord(null);
          }}
        />
      )}

      {/* Companion FAB — wax seal */}
      <button
        id="companion-fab"
        className="fixed bottom-8 right-8 z-50"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: book.palette.primary,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          transition: "transform 0.2s var(--ease-book)",
          color: book.palette.paper,
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "1.2rem",
          fontStyle: "italic",
        }}
        onClick={() => setCompanionOpen((v) => !v)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.08) translateY(-2px)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
      >
        {companionOpen ? "×" : book.companionName[0]}
      </button>

      {/* Companion panel */}
      {companionOpen && (
        <CompanionPanel
          book={book}
          messages={messages}
          inputText={inputText}
          onInputChange={setInputText}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
}

// ─── Interactive Word ─────────────────────────────────────────────────────

function InteractiveWord({
  word,
  onClick,
}: {
  word: string;
  onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="readable-word"
      style={{
        background: hovered ? "var(--gold-light)" : "transparent",
        color: "inherit",
        cursor: "pointer",
        padding: "0 1px",
        borderRadius: "1px",
        transition: "background 80ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {word}{" "}
    </span>
  );
}

// ─── Word popover ─────────────────────────────────────────────────────────

function WordPopover({
  word,
  pos,
  bookId,
  onClose,
  onSave,
}: {
  word: string;
  pos: { x: number; y: number };
  bookId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, text: word }),
      });
      const data = await res.json();
      setExplanation(data.explanation || "No explanation found.");
    } catch {
      setExplanation("Could not load explanation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50"
        style={{
          left: Math.min(pos.x, window.innerWidth - 300),
          top: pos.y - 80,
          background: "var(--surface-elevated)",
          border: "1px solid var(--sepia-line)",
          padding: "1rem",
          boxShadow: "var(--shadow-page)",
          width: "280px",
        }}
      >
        <p
          className="font-display italic"
          style={{
            fontSize: "1.2rem",
            color: "var(--ink)",
            marginBottom: "0.75rem",
          }}
        >
          &ldquo;{word}&rdquo;
        </p>

        {explanation ? (
          <p
            className="font-reading"
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
              color: "var(--ink-faint)",
              marginBottom: "1rem",
            }}
          >
            {explanation}
          </p>
        ) : loading ? (
          <p
            className="font-reading italic"
            style={{
              fontSize: "0.9rem",
              color: "var(--ink-ghost)",
              marginBottom: "1rem",
            }}
          >
            Seeking meaning...
          </p>
        ) : null}

        <div style={{ display: "flex", gap: "1rem" }}>
          {!explanation && !loading && (
            <button
              className="editorial-caption"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--gold-accent)",
                padding: 0,
              }}
              onClick={handleExplain}
            >
              Explain this →
            </button>
          )}
          <button
            className="editorial-caption"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-ghost)",
              padding: 0,
            }}
            onClick={onSave}
          >
            Save to notes
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Companion Panel ──────────────────────────────────────────────────────

function CompanionPanel({
  book,
  messages,
  inputText,
  onInputChange,
  onSend,
}: {
  book: Book;
  messages: { role: "companion" | "reader"; text: string }[];
  inputText: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div
      className="fixed right-0 top-0 bottom-0 z-40 flex flex-col"
      style={{
        width: "380px",
        background: "var(--surface-elevated)",
        borderLeft: "1px solid var(--sepia-line)",
        boxShadow: "-8px 0 40px rgba(28,22,18,0.08)",
      }}
    >
      {/* Companion header */}
      <div
        style={{
          padding: "5rem 2rem 1.5rem",
          borderBottom: "1px solid var(--sepia-line)",
        }}
      >
        <p
          className="editorial-caption"
          style={{ color: "var(--ink-whisper)", marginBottom: "0.25rem" }}
        >
          Reading companion
        </p>
        <p
          className="font-display italic"
          style={{ fontSize: "1.5rem", color: "var(--ink)" }}
        >
          {book.companionName}
        </p>
      </div>

      {/* Messages — handcrafted, not chat bubbles */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              opacity: 0,
              animation: `fade-up 0.4s ${i * 100}ms var(--ease-book) both`,
            }}
          >
            {msg.role === "companion" ? (
              <div>
                <p
                  className="editorial-caption"
                  style={{
                    color: book.palette.accent ?? "var(--gold-accent)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {book.companionName}
                </p>
                <p
                  className="font-reading"
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "var(--ink-faint)",
                    fontStyle: "italic",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            ) : (
              <div>
                <p
                  className="editorial-caption"
                  style={{
                    color: "var(--ink-whisper)",
                    marginBottom: "0.5rem",
                    textAlign: "right",
                  }}
                >
                  You
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    color: "var(--ink)",
                    textAlign: "right",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input — a single ruled line */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderTop: "1px solid var(--sepia-line)",
        }}
      >
        <div
          style={{
            borderBottom: "1.5px solid var(--ink)",
            paddingBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <input
            id="companion-input"
            placeholder="Write to your companion..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-reading), Georgia, serif",
              fontSize: "0.95rem",
              color: "var(--ink)",
              fontStyle: "italic",
            }}
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
          />
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-ghost)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-geist-sans), sans-serif",
              padding: 0,
            }}
            onClick={onSend}
          >
            Send
          </button>
        </div>
        <p
          className="editorial-caption"
          style={{
            color: "var(--ink-whisper)",
            marginTop: "0.5rem",
            fontSize: "0.6rem",
          }}
        >
          Press Enter to send
        </p>
      </div>
    </div>
  );
}

// ─── Sample text generator ────────────────────────────────────────────────

export function generateSampleText(book: Book): string[] {
  const samples: Record<string, string[]> = {
    fantasy: [
      "The map had been folded and refolded so many times that the creases had worn through at the corners, leaving small islands of nothing where the mountains should have been. Aldric held it up to the failing light of the lantern and tried to make sense of what remained.",
      "There were rules about crossing the Bone Meridian, and the first of them was that you did not talk about the crossing while you were still within sight of the last village. The village elders had reasons for this rule, and most of those reasons had names.",
      "Magic was not a gift. It was an inheritance, like debt — passed down without consent through bloodlines that had long forgotten why they deserved it. Some families had spent generations trying to give it back.",
      "The dragon had not spoken in eleven years. This was, by dragon standards, considered a very long silence. By human standards it was considered ominous. By the dragon's own estimate, it was simply a very long thought.",
    ],
    thriller: [
      "The file was thinner than she expected. Seventeen pages, three photographs, one name. She had spent four months on this case and this — this thin folder — was everything that remained of a man who had once been everywhere.",
      "Trust was a currency she'd stopped spending years ago. The economy of her particular life had no use for it. What she traded in instead was information, and right now, she was deeply in debt.",
      "He'd made three mistakes. The first was leaving a witness. The second was underestimating how long a determined woman could hold a grudge. The third — the one that would define the rest of his considerably shortened life — was coming back.",
    ],
    philosophy: [
      "The question was not what was true. The question was what could be known, and whether the knowing of it was available to creatures constituted as we are — creatures of appetite and fear, of longing and revision, reading the world through the very instruments the world had shaped.",
      "Every system of ethics begins as an answer to violence. What is justice if not the attempt to replace the logic of strength with something more durable, more imaginable to those who have none?",
      "To think carefully is to think slowly. This is why thinking carefully has always been unpopular. Slowness is a form of resistance, and people who move quickly have little patience for those who stop.",
    ],
    history: [
      "The city had burned three times in seven hundred years and each time it had been rebuilt slightly differently, as though the memory of the fire had been absorbed into the stone, altering the way the streets ran, the way light fell in the early morning.",
      "Empires do not collapse. They contract. They retreat, first from the edges, then from the ambitions, then from the very language they used to describe themselves. What falls at the end is only the name.",
      "She kept the letters in a cedar box that still smelled faintly of the ship that had carried it across an ocean she would never see again. The wood remembered distances that she had trained herself to forget.",
    ],
    science: [
      "The universe, it turned out, was not interested in being understood. It was interested in existing. The understanding was something that happened in a very thin biological layer on a very ordinary planet, and the universe had arranged for this through no intention whatsoever.",
      "For a long time we believed that complexity required a designer. Then we discovered that complexity was precisely what you got when simple rules ran for long enough without one. This was, to put it gently, unsettling.",
      "Every atom in your body is older than the solar system. You are constructed of material that has already been a star. Whether this makes you feel significant or insignificant depends entirely on you, and either answer is correct.",
    ],
  };

  return (
    samples[book.genre as keyof typeof samples] ??
    samples["science"] ?? [
      "The book you hold in your hands began as a different book entirely. Most books do. What you read is always a translation — from experience to thought, from thought to word, from word to the particular light you happen to be reading in.",
      "Begin anywhere. The best books do not require a beginning. They require only your attention, which is the rarest thing you have to give.",
    ]
  );
}
