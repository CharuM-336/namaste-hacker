import React, { forwardRef, memo } from "react";
import { Box } from "../../../../design-system/primitives/Box";

export interface BadgeProps {
  // Placeholder props – accept any
  [key: string]: any;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder Badge component */}
    Badge Component
  </Box>
));

export default memo(Badge);
