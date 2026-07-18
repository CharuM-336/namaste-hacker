import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface HoverCardProps {
  // Accept any props for now
  [key: string]: any;
}

const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder HoverCard component */}
    HoverCard Component
  </Box>
));

export default memo(HoverCard);
