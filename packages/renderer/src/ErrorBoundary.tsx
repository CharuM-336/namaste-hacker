// src/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import type { RenderNode } from "./types";

/**
 * Simple placeholder shown when a component type is not registered.
 * It displays the missing type and node id to aid developers.
 */
export const PlaceholderComponent: React.FC<{ node: RenderNode }> = ({ node }) => {
  const type = "kind" in node.data ? (node.data as any).kind : "unknown";
  const id = (node.data as any).id ?? "N/A";
  return (
    <div style={{
      border: "2px dashed #ff4d4f",
      padding: "8px",
      margin: "4px",
      backgroundColor: "#fff1f0",
      color: "#a8071a",
    }}>
      <strong>Missing Component</strong> – type: {type}, id: {id}
    </div>
  );
};

/**
 * Generic error boundary that catches rendering errors for a subtree.
 * In development it shows the error message; in production it falls back
 * to the placeholder component.
 */
export class RenderErrorBoundary extends Component<{ children?: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("RenderErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong while rendering.</div>;
    }
    return this.props.children;
  }
}
