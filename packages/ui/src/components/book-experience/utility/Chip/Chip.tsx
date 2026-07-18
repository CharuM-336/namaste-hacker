import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface ChipProps {
  [key: string]: any;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder Chip component */}
    Chip Component
  </Box>
));

export default memo(Chip);
