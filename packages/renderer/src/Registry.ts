// src/Registry.ts
import type { RenderNode } from "./types";
import type React from "react";

/**
 * Factory function that, given a RenderNode and context, returns a React element.
 */
export type ComponentFactory = (node: RenderNode, ctx: RenderContext) => React.ReactNode;

export interface RenderContext {
  registry: ComponentRegistry;
  debug?: boolean;
  // placeholder for future state store, etc.
}

/**
 * ComponentRegistry maps blueprint type/kind strings to ComponentFactory functions.
 * No switch/if chains – registration is extensible.
 */
export class ComponentRegistry {
  private factories = new Map<string, ComponentFactory>();

  /** Register a factory for a given type name */
  register(type: string, factory: ComponentFactory): void {
    if (this.factories.has(type)) {
      console.warn(`Overriding existing factory for type "${type}"`);
    }
    this.factories.set(type, factory);
  }

  /** Retrieve a factory; returns undefined if not found */
  get(type: string): ComponentFactory | undefined {
    return this.factories.get(type);
  }
}

/** Default singleton registry pre‑populated with core placeholders */
export const defaultRegistry = new ComponentRegistry();

// Register a generic placeholder for unknown components
import { PlaceholderComponent } from "./ErrorBoundary";

defaultRegistry.register("unknown", (node, _ctx) => {
  return React.createElement(PlaceholderComponent, { node });
});
