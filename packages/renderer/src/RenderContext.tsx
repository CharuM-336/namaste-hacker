// src/RenderContext.tsx
import React, { createContext, useContext } from "react";
import { ComponentRegistry } from "./Registry";

export interface RendererOptions {
  debug?: boolean;
  // future: stateStore, etc.
}

export interface RenderContextProps extends RendererOptions {
  registry: ComponentRegistry;
}

// Create a React context with no default (will be provided by Renderer)
const RenderContext = createContext<RenderContextProps | undefined>(undefined);

export const RenderProvider: React.FC<{ children: React.ReactNode; registry: ComponentRegistry; options?: RendererOptions }> = ({ children, registry, options }) => {
  const contextValue: RenderContextProps = {
    registry,
    debug: options?.debug,
  };
  return <RenderContext.Provider value={contextValue}>{children}</RenderContext.Provider>;
};

/** Hook to access the RenderContext */
export function useRenderContext(): RenderContextProps {
  const ctx = useContext(RenderContext);
  if (!ctx) {
    throw new Error("useRenderContext must be used within a RenderProvider");
  }
  return ctx;
}
