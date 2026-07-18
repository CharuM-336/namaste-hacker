// src/components/LoadingSpinner.tsx
import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
    <svg width="40" height="40" viewBox="0 0 40 40" stroke="#1890ff">
      <circle cx="20" cy="20" r="18" fill="none" strokeWidth="4" strokeOpacity="0.2" />
      <circle cx="20" cy="20" r="18" fill="none" strokeWidth="4" strokeDasharray="80" strokeDashoffset="60">
        <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);
