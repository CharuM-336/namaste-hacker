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
import ArrivalHero from "../../ui/src/components/experience/ArrivalHero/ArrivalHero";
import ChapterCard from "../../ui/src/components/experience/ChapterCard/ChapterCard";
import SectionHeading from "../../ui/src/components/experience/SectionHeading/SectionHeading";
import TextBlock from "../../ui/src/components/experience/TextBlock/TextBlock";
import Divider from "../../ui/src/components/experience/Divider/Divider";

defaultRegistry.register("unknown", (node, _ctx) => {
  return React.createElement(PlaceholderComponent, { node });
});

defaultRegistry.register("arrival-hero", (node, _ctx) => React.createElement(ArrivalHero, node.data));
defaultRegistry.register("chapter-card", (node, _ctx) => React.createElement(ChapterCard, node.data));
defaultRegistry.register("section-heading", (node, _ctx) => React.createElement(SectionHeading, node.data));
defaultRegistry.register("text-block", (node, _ctx) => React.createElement(TextBlock, node.data));
defaultRegistry.register("divider", (node, _ctx) => React.createElement(Divider, node.data));

defaultRegistry.register("unknown", (node, _ctx) => {
  return React.createElement(PlaceholderComponent, { node });
});
