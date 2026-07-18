// src/components/book-experience/navigation/ProgressIndicator/ProgressIndicator.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "../../../../design-system/primitives/Box";
import { colors, spacing, radius } from "../../../../design-system/tokens";
import styles from "./ProgressIndicator.module.css";

export interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  variant?: "default" | "accent";
  className?: string;
  style?: React.CSSProperties;
}

const ProgressIndicator = forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  ({ totalSteps, currentStep, variant = "default", className, style }, ref) => {
    const percent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
    return (
      <Box
        ref={ref}
        className={`${styles.progressIndicator} ${styles[variant]} ${className ?? ""}`}
        style={{
          ...style,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.sm,
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
      >
        <div className={styles.track}>
          <div className={styles.filler} style={{ width: `${percent}%` }} />
        </div>
        <div className={styles.label}>Step {currentStep} of {totalSteps}</div>
      </Box>
    );
  }
);

export default memo(ProgressIndicator);
