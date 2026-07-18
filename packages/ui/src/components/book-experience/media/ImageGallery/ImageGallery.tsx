// src/components/book-experience/media/ImageGallery/ImageGallery.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import { colors, spacing, radius, shadows } from "@namaste-hacker/ui/design-system/tokens";
import styles from "./ImageGallery.module.css";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  layout?: "grid" | "masonry";
  columns?: number; // only for grid layout
  lazy?: boolean;
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(
  (
    {
      images = [],
      layout = "grid",
      columns = 3,
      lazy = true,
      variant = "default",
      loading = false,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    if (loading) return <div className={styles.loading}>Loading…</div>;
    if (error) return <div className={styles.error}>Failed to load gallery.</div>;
    if (images.length === 0) return null;
    const gridStyle: React.CSSProperties = layout === "grid" ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {};
    return (
      <Box
        ref={ref}
        className={`${styles.gallery} ${styles[layout]} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          ...gridStyle,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.sm,
          boxShadow: shadows.sm,
          display: layout === "grid" ? "grid" : "block",
          gap: spacing.sm,
        }}
        role="region"
        aria-label="Image Gallery"
      >
        {images.map((img, i) => (
          <figure key={i} className={styles.figure}>
            <img src={img.src} alt={img.alt} loading={lazy ? "lazy" : "eager"} className={styles.image} />
            {img.caption && <figcaption className={styles.caption}>{img.caption}</figcaption>}
          </figure>
        ))}
      </Box>
    );
  },
);

export default memo(ImageGallery);
