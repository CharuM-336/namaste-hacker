// src/components/book-experience/media/VideoEmbed/VideoEmbed.tsx
import React, { forwardRef, memo } from "react";
import { Box } from "@namaste-hacker/ui/design-system/primitives/Box";
import classNames from "classnames";
import styles from "./VideoEmbed.module.css";

export interface VideoEmbedProps {
  /** URL of the video to embed (YouTube, Vimeo, etc.) */
  src: string;
  /** Optional title for accessibility */
  title?: string;
  /** Optional className */
  className?: string;
  /** Optional style */
  style?: React.CSSProperties;
}

const VideoEmbed = forwardRef<HTMLDivElement, VideoEmbedProps>(
  ({ src, title = "Embedded video", className, style }, ref) => (
    <Box
      ref={ref}
      className={classNames(styles.videoEmbed, className)}
      style={style}
    >
      <iframe
        src={src}
        title={title}
        allowFullScreen
        className={styles.iframe}
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </Box>
  ),
);

export default memo(VideoEmbed);
