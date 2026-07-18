import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface InfoPopoverProps {
  // placeholder – accept any props
  [key: string]: any;
}

const InfoPopover = forwardRef<HTMLDivElement, InfoPopoverProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder InfoPopover component */}
    InfoPopover Component
  </Box>
));

export default memo(InfoPopover);
