// src/Registry.ts
import type { RenderNode } from "./types";
import React from "react";

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
import ChapterNavigator from "../../ui/src/components/book-experience/navigation/ChapterNavigator/ChapterNavigator";
import ProgressIndicator from "../../ui/src/components/book-experience/navigation/ProgressIndicator/ProgressIndicator";
import ReadingPath from "../../ui/src/components/book-experience/navigation/ReadingPath/ReadingPath";
import Breadcrumb from "../../ui/src/components/book-experience/navigation/Breadcrumb/Breadcrumb";

// Media components
import ImageBlock from "../../ui/src/components/book-experience/media/ImageBlock/ImageBlock";
import ImageGallery from "../../ui/src/components/book-experience/media/ImageGallery/ImageGallery";
import Illustration from "../../ui/src/components/book-experience/media/Illustration/Illustration";
import ComparisonSlider from "../../ui/src/components/book-experience/media/ComparisonSlider/ComparisonSlider";
import VideoEmbed from "../../ui/src/components/book-experience/media/VideoEmbed/VideoEmbed";
import ExpandableSection from "../../ui/src/components/book-experience/interactive/ExpandableSection/ExpandableSection";
import Accordion from "../../ui/src/components/book-experience/interactive/Accordion/Accordion";
import Tabs from "../../ui/src/components/book-experience/interactive/Tabs/Tabs";
import Tooltip from "../../ui/src/components/book-experience/interactive/Tooltip/Tooltip";
import InfoPopover from "../../ui/src/components/book-experience/interactive/InfoPopover/InfoPopover";
import HoverCard from "../../ui/src/components/book-experience/interactive/HoverCard/HoverCard";

// Knowledge components
import KeyTakeaways from "../../ui/src/components/book-experience/knowledge/KeyTakeaways/KeyTakeaways";
import MindMapPreview from "../../ui/src/components/book-experience/knowledge/MindMapPreview/MindMapPreview";
import ConceptGraph from "../../ui/src/components/book-experience/knowledge/ConceptGraph/ConceptGraph";
import Flashcard from "../../ui/src/components/book-experience/knowledge/Flashcard/Flashcard";
import QuizPreview from "../../ui/src/components/book-experience/knowledge/QuizPreview/QuizPreview";
import Badge from "../../ui/src/components/book-experience/utility/Badge/Badge";
import Chip from "../../ui/src/components/book-experience/utility/Chip/Chip";
import Tag from "../../ui/src/components/book-experience/utility/Tag/Tag";
import Statistic from "../../ui/src/components/book-experience/utility/Statistic/Statistic";
import IconLabel from "../../ui/src/components/book-experience/utility/IconLabel/IconLabel";

defaultRegistry.register("unknown", (node, _ctx) => {
  return React.createElement(PlaceholderComponent, { node });
});

defaultRegistry.register("arrival-hero", (node, _ctx) => React.createElement(ArrivalHero, node.data as any));
defaultRegistry.register("chapter-card", (node, _ctx) => React.createElement(ChapterCard, node.data as any));
defaultRegistry.register("section-heading", (node, _ctx) => React.createElement(SectionHeading, node.data as any));
defaultRegistry.register("text-block", (node, _ctx) => React.createElement(TextBlock, node.data as any));
defaultRegistry.register("divider", (node, _ctx) => React.createElement(Divider, node.data as any));

// Media component registrations
defaultRegistry.register("image-block", (node, _ctx) => React.createElement(ImageBlock, node.data as any));
defaultRegistry.register("image-gallery", (node, _ctx) => React.createElement(ImageGallery, node.data as any));
defaultRegistry.register("illustration", (node, _ctx) => React.createElement(Illustration, node.data as any));
defaultRegistry.register("comparison-slider", (node, _ctx) => React.createElement(ComparisonSlider, node.data as any));
defaultRegistry.register("video-embed", (node, _ctx) => React.createElement(VideoEmbed, node.data as any));

// Knowledge component registrations
defaultRegistry.register("key-takeaways", (node, _ctx) => React.createElement(KeyTakeaways, node.data as any));
defaultRegistry.register("mindmap-preview", (node, _ctx) => React.createElement(MindMapPreview, node.data as any));
defaultRegistry.register("concept-graph", (node, _ctx) => React.createElement(ConceptGraph, node.data as any));
defaultRegistry.register("flashcard", (node, _ctx) => React.createElement(Flashcard, node.data as any));
defaultRegistry.register("quiz-preview", (node, _ctx) => React.createElement(QuizPreview, node.data as any));
// Navigation component registrations
defaultRegistry.register("chapter-navigator", (node, _ctx) => React.createElement(ChapterNavigator, node.data as any));
defaultRegistry.register("progress-indicator", (node, _ctx) => React.createElement(ProgressIndicator, node.data as any));
defaultRegistry.register("reading-path", (node, _ctx) => React.createElement(ReadingPath, node.data as any));
defaultRegistry.register("breadcrumb", (node, _ctx) => React.createElement(Breadcrumb, node.data as any));

// Interaction component registrations
defaultRegistry.register("expandable-section", (node, _ctx) => React.createElement(ExpandableSection, node.data as any));
defaultRegistry.register("accordion", (node, _ctx) => React.createElement(Accordion, node.data as any));
defaultRegistry.register("tabs", (node, _ctx) => React.createElement(Tabs, node.data as any));
defaultRegistry.register("tooltip", (node, _ctx) => React.createElement(Tooltip, node.data as any));
defaultRegistry.register("info-popover", (node, _ctx) => React.createElement(InfoPopover, node.data as any));
defaultRegistry.register("hover-card", (node, _ctx) => React.createElement(HoverCard, node.data as any));

// Utility component registrations
defaultRegistry.register("badge", (node, _ctx) => React.createElement(Badge, node.data as any));
defaultRegistry.register("chip", (node, _ctx) => React.createElement(Chip, node.data as any));
defaultRegistry.register("tag", (node, _ctx) => React.createElement(Tag, node.data as any));
defaultRegistry.register("statistic", (node, _ctx) => React.createElement(Statistic, node.data as any));
defaultRegistry.register("icon-label", (node, _ctx) => React.createElement(IconLabel, node.data as any));
