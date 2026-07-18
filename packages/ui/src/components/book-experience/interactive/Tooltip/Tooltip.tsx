import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface TooltipProps {
  // Accept any props for now
  [key: string]: any;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder Tooltip component */}
    Tooltip Component
  </Box>
));

export default memo(Tooltip);
