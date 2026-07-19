// src/components/book-experience/WorldMap/WorldMap.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../design-system/primitives/Box";
import {
  colors,
  spacing,
  radius,
  typography,
  shadows,
} from "../../../design-system/tokens";
import styles from "./WorldMap.module.css";

export interface Location {
  id: string;
  name: string;
  x: number; // coordinate relative to map container (0-1)
  y: number;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface WorldMapProps {
  locations: Location[];
  variant?: "default" | "compact";
  loading?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // Future: onLocationSelect?: (id: string) => void;
}

const WorldMap = forwardRef<HTMLDivElement, WorldMapProps>(
  (
    {
      locations,
      variant = "default",
      loading = false,
      error = false,
      className,
      style,
    },
    ref,
  ) => {
    if (loading) {
      return <div className={styles.loading}>Loading…</div>;
    }
    if (error) {
      return <div className={styles.error}>Failed to load map.</div>;
    }
    return (
      <Box
        ref={ref}
        className={`${styles.worldMap} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.sm,
          boxShadow: shadows.sm,
          position: "relative",
        }}
        role="region"
        aria-label="World Map"
      >
        {/* Placeholder map background */}
        <div className={styles.mapBackground} />
        {locations.map((loc) => (
          <div
            key={loc.id}
            className={styles.marker}
            style={{
              left: `${loc.x * 100}%`,
              top: `${loc.y * 100}%`,
            }}
            aria-label={loc.label ?? loc.name}
          >
            <span className={styles.markerLabel}>{loc.label ?? loc.name}</span>
          </div>
        ))}
      </Box>
    );
  },
);

export default memo(WorldMap);
