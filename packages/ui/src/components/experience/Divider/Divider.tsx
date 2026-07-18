// src/components/experience/Divider/Divider.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import classNames from "classnames";
import styles from "./Divider.module.css";

export interface DividerProps {
  /** optional className */
  className?: string;
  /** optional style */
  style?: React.CSSProperties;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(({ className, style }, ref) => {
  return (
    <Box
      ref={ref}
      className={classNames(styles.divider, className)}
      style={style}
      role="separator"
    >
      <hr className={styles.hr} />
    </Box>
  );
});

export default memo(Divider);
