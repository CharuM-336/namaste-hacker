// src/builtins/Timeline.tsx
import React from "react";
import type { RenderNode } from "../types";

/** Placeholder Timeline component */
const Timeline: React.FC<{ node: RenderNode }> = ({ node }) => {
  const config = (node.data as any).config || {};
  return (
    <section style={{ padding: "1rem", backgroundColor: "#e0f7fa", borderRadius: "8px" }}>
      <h2>{config.title || "Timeline"}</h2>
      {/* Add more placeholder UI as needed */}
    </section>
  );
};

export default Timeline;
