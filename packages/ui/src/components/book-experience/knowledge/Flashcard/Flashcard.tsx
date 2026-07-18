import React, { forwardRef, memo } from 'react';
import { Box } from '../../../../design-system/primitives/Box';

export interface FlashcardProps {
  [key: string]: any;
}

const Flashcard = forwardRef<HTMLDivElement, FlashcardProps>((props, ref) => (
  <Box ref={ref} {...props}>
    {/* Placeholder Flashcard component */}
    Flashcard Component
  </Box>
));

export default memo(Flashcard);
