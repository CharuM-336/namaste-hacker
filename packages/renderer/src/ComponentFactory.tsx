// src/ComponentFactory.tsx
import React, { lazy, Suspense } from "react";
import type { RenderNode, Component, Module, Scene, Zone, World } from "./types";
import { RenderErrorBoundary } from "./ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
import type { RenderContext } from "./Registry";

/**
 * Resolve a component kind to a lazily loaded React component.
 * The map can be extended via registry registration.
 */
const lazyComponentMap: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  HeroBanner: () => import("./builtins/HeroBanner"),
  Timeline: () => import("./builtins/Timeline"),
  unknown: () => Promise.resolve({ default: () => null }),
};

/**
 * Factory that creates a React element for a RenderNode.
 * It handles lazy loading and wraps the result in an error boundary.
 */
export const defaultComponentFactory = (node: RenderNode, ctx: RenderContext): React.ReactNode => {
  const { registry } = ctx;
  const typeKey = (() => {
    switch (node.nodeType) {
      case "component":
        return (node.data as Component).kind;
      case "module":
        return (node.data as Module).type;
      case "scene":
        return (node.data as Scene).type;
      case "zone":
        return "zone";
      case "world":
        return "world";
      default:
        return "unknown";
    }
  })();

  const customFactory = registry.get(typeKey);
  if (customFactory) {
    return customFactory(node, ctx);
  }

  const lazyImport = lazyComponentMap[typeKey] || lazyComponentMap["unknown"];
  const LazyComp = lazy(lazyImport);
  return (
    <RenderErrorBoundary fallback={<div>Failed to load {typeKey}</div>}>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComp node={node} />
      </Suspense>
    </RenderErrorBoundary>
  );
};
