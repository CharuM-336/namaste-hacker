// src/builtins/HeroBanner.tsx
import React from "react";
import type { RenderNode } from "../types";

/** Simple placeholder for the HeroBanner component */
const HeroBanner: React.FC<{ node: RenderNode }> = ({ node }) => {
  const config = (node.data as any).config || {};
  return (
    <section
      style={{
        padding: "2rem",
        backgroundColor: "#fafafa",
        textAlign: "center",
      }}
    >
      <h1>{config.title || "Hero Banner"}</h1>
      {config.subtitle && <h3>{config.subtitle}</h3>}
    </section>
  );
};

export default HeroBanner;
