// src/types.ts
/**
 * Type definitions for Website Blueprint objects used by the renderer.
 * These are a thin TypeScript mapping of the JSON schema defined in the documentation.
 */

export interface Blueprint {
  schemaVersion: string;
  metadata: BlueprintMetadata;
  world: World;
}

export interface BlueprintMetadata {
  bookId: string;
  title: string;
  author: string;
  created: string; // ISO date
  updated?: string;
  tags?: string[];
}

export interface World {
  id: string;
  title: string;
  ambient?: Ambient;
  theme?: Theme;
  progressModel?: ProgressModel;
  personalization?: Personalization;
  scenes: Scene[];
}

export interface Ambient {
  backgroundMusic?: string;
  ambientSounds?: string[];
  lightingPreset?: string;
}

export interface Theme {
  palette?: Record<string, string>;
  typography?: Typography;
}

export interface Typography {
  fontFamily?: string;
  weightScale?: Record<string, number>;
  sizeScale?: Record<string, number>;
  lineHeight?: number;
}

export interface ProgressModel {
  totalUnits?: number;
  milestones?: string[];
  completionCriteria?: string;
}

export interface Personalization {
  locale?: string;
  accessibility?: Record<string, unknown>;
  featureFlags?: string[];
}

export interface Scene {
  id: string;
  type: string; // e.g., "Arrival", "Reading", etc.
  layout?: Layout;
  zones?: Zone[];
  modules?: Module[];
  transitions?: Record<string, unknown>;
  hooks?: Record<string, unknown>;
}

export interface Layout {
  type?: string; // "grid" | "flex" | "absolute"
  columns?: number;
  gutter?: number;
  responsive?: unknown[];
}

export interface Zone {
  id: string;
  bounds: Record<string, unknown>;
  visibilityRule?: string;
  modules?: Module[];
}

export interface Module {
  id: string;
  type: string; // module type name, e.g., "HeroBanner"
  config?: Record<string, unknown>;
  state?: Record<string, unknown>;
  components?: Component[];
  interactions?: Interaction[];
}

export interface Component {
  id: string;
  kind: string; // component kind, e.g., "richText"
  props?: Record<string, unknown>;
  styleOverrides?: Record<string, unknown>;
  children?: Component[];
}

export interface Interaction {
  id: string;
  event: string; // "click", "hover", etc.
  target: string; // component id
  action: {
    type: string;
    payload?: Record<string, unknown>;
  };
  condition?: Record<string, unknown>;
}

export interface Animation {
  id: string;
  type: string;
  durationMs: number;
  easing?: string;
  delayMs?: number;
  repeat?: number;
  trigger?: string;
}

/** Union type for any node that can be rendered recursively */
export type RenderNode =
  | { nodeType: "world"; data: World }
  | { nodeType: "scene"; data: Scene }
  | { nodeType: "zone"; data: Zone }
  | { nodeType: "module"; data: Module }
  | { nodeType: "component"; data: Component }
  | { nodeType: "interaction"; data: Interaction }
  | { nodeType: "animation"; data: Animation };
