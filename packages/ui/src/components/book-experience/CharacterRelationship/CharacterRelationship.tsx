// src/components/book-experience/CharacterRelationship/CharacterRelationship.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import { colors, spacing, radius, typography, shadows } from "../../../design-system/tokens";
import styles from "./CharacterRelationship.module.css";

export interface Relationship {
  source: string; // character id
  target: string; // character id
  type: string; // e.g., "friend", "enemy"
  strength?: number; // 0-100
  directional?: boolean;
}

export interface CharacterRelationshipProps {
  relationships: Relationship[];
  charactersMap: Record<string, { name: string; avatarUrl?: string }>; // map id to minimal data
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CharacterRelationship = forwardRef<HTMLDivElement, CharacterRelationshipProps>(
  (
    { relationships, charactersMap, variant = "default", loading = false, error = false, className, style },
    ref,
  ) => {
    if (loading) {
      return <div className={styles.loading}>Loading…</div>;
    }
    if (error) {
      return <div className={styles.error}>Failed to load relationships.</div>;
    }
    if (!relationships || relationships.length === 0) {
      return null;
    }
    return (
      <Box
        ref={ref}
        className={`${styles.relationships} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          boxShadow: shadows.sm,
        }}
        role="list"
        aria-label="Character Relationships"
      >
        {relationships.map((rel, i) => {
          const source = charactersMap[rel.source];
          const target = charactersMap[rel.target];
          return (
            <div key={i} className={styles.relationship} role="listitem">
              <div className={styles.avatarWrapper}>
                {source?.avatarUrl && (
                  <img src={source.avatarUrl} alt={source.name} className={styles.avatar} />
                )}
                <span className={styles.name}>{source?.name ?? rel.source}</span>
              </div>
              <div className={styles.arrow} aria-hidden="true">
                {rel.directional ? "→" : "—"}
              </div>
              <div className={styles.avatarWrapper}>
                {target?.avatarUrl && (
                  <img src={target.avatarUrl} alt={target.name} className={styles.avatar} />
                )}
                <span className={styles.name}>{target?.name ?? rel.target}</span>
              </div>
              <div className={styles.meta}>
                <span className={styles.type}>{rel.type}</span>
                {rel.strength !== undefined && (
                  <span className={styles.strength}>Strength: {rel.strength}</span>
                )}
              </div>
            </div>
          );
        })}
      </Box>
    );
  },
);

export default memo(CharacterRelationship);
