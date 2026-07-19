// src/components/reading-experience/Notebook/Notebook.tsx
import React, { forwardRef, memo, useState } from "react";
import { Box } from "../../../design-system/primitives/Box";
import { colors, spacing, radius } from "../../../design-system/tokens";
import styles from "./Notebook.module.css";

export interface Note {
  id: string;
  content: string;
  pinned?: boolean;
  timestamp?: string; // ISO string
}

export interface Section {
  id: string;
  title: string;
  notes: Note[];
}

export interface NotebookProps {
  sections: Section[];
  variant?: "compact" | "expanded";
  className?: string;
  style?: React.CSSProperties;
}

const Notebook = forwardRef<HTMLDivElement, NotebookProps>(
  ({ sections, variant = "expanded", className, style }, ref) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
      {},
    );
    const toggleSection = (id: string) => {
      setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    return (
      <Box
        ref={ref}
        className={`${styles.notebook} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.background,
          borderRadius: radius.lg,
          padding: spacing.lg,
        }}
      >
        {sections.map((section) => (
          <section
            key={section.id}
            className={styles.section}
            data-searchable="true"
          >
            <header
              className={styles.header}
              onClick={() => toggleSection(section.id)}
            >
              <h3 className={styles.title}>{section.title}</h3>
            </header>
            {(openSections[section.id] ?? variant === "expanded") ? (
              <ul className={styles.notes}>
                {section.notes.map((note) => (
                  <li
                    key={note.id}
                    className={`${styles.note} ${note.pinned ? styles.pinned : ""}`}
                  >
                    <p className={styles.content}>{note.content}</p>
                    {note.timestamp && (
                      <time className={styles.time}>
                        {new Date(note.timestamp).toLocaleString()}
                      </time>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </Box>
    );
  },
);

export default memo(Notebook);
