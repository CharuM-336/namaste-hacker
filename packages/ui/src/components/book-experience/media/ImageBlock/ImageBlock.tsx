// src/components/book-experience/media/ImageBlock/ImageBlock.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import {
  colors,
  spacing,
  radius,
  shadows,
} from "@namaste-hacker/ui/design-system/tokens";
import styles from "./ImageBlock.module.css";

export interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  rounded?: boolean;
  fullWidth?: boolean;
  lazy?: boolean;
  metadata?: Record<string, unknown>;
  variant?: "default" | "rounded"; // kept for future
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ImageBlock = forwardRef<HTMLDivElement, ImageBlockProps>(
  (
    {
      src,
      alt,
      caption,
      rounded = false,
      fullWidth = false,
      lazy = true,
      variant,
      loading = false,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    if (loading) return <div className={styles.loading}>Loading…</div>;
    if (error) return <div className={styles.error}>Failed to load image.</div>;
    return (
      <Box
        ref={ref}
        className={`${styles.imageBlock} ${fullWidth ? styles.fullWidth : ""} ${rounded ? styles.rounded : ""} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.sm,
          boxShadow: shadows.sm,
        }}
        role="figure"
        aria-label={alt}
      >
        <img
          src={src}
          alt={alt}
          className={styles.image}
          loading={lazy ? "lazy" : "eager"}
        />
        {caption && (
          <figcaption className={styles.caption}>{caption}</figcaption>
        )}
      </Box>
    );
  },
);

export default memo(ImageBlock);
