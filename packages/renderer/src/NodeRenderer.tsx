// src/NodeRenderer.tsx
import React, { memo } from "react";
import type { RenderNode, World, Scene, Zone, Module, Component } from "./types";
import { useRenderContext } from "./RenderContext";
import { defaultComponentFactory } from "./ComponentFactory";
import { RenderErrorBoundary } from "./ErrorBoundary";

/**
 * Recursive renderer that walks the blueprint hierarchy and renders each node.
 * It leverages the ComponentRegistry to resolve visual components.
 */
export const NodeRenderer: React.FC<{ node: RenderNode }> = memo(({ node }) => {
  const ctx = useRenderContext();
  const renderChildren = (children: RenderNode[]) =>
    children.map(child => <NodeRenderer key={child.data.id} node={child} />);

  switch (node.nodeType) {
    case "world": {
      const world = node.data as World;
      return (
        <RenderErrorBoundary>
          <div data-node-type="world" data-id={world.id}>
            {world.scenes?.map(scene => (
              <NodeRenderer key={scene.id} node={{ nodeType: "scene", data: scene }} />
            ))}
          </div>
        </RenderErrorBoundary>
      );
    }
    case "scene": {
      const scene = node.data as Scene;
      return (
        <RenderErrorBoundary>
          <section data-node-type="scene" data-id={scene.id}>
            {/* Render zones first (if any) */}
            {scene.zones?.map(zone => (
              <NodeRenderer key={zone.id} node={{ nodeType: "zone", data: zone }} />
            ))}
            {/* Then render modules directly attached to the scene */}
            {scene.modules?.map(mod => (
              <NodeRenderer key={mod.id} node={{ nodeType: "module", data: mod }} />
            ))}
          </section>
        </RenderErrorBoundary>
      );
    }
    case "zone": {
      const zone = node.data as Zone;
      return (
        <RenderErrorBoundary>
          <div data-node-type="zone" data-id={zone.id}>
            {zone.modules?.map(mod => (
              <NodeRenderer key={mod.id} node={{ nodeType: "module", data: mod }} />
            ))}
          </div>
        </RenderErrorBoundary>
      );
    }
    case "module": {
      const mod = node.data as Module;
      return (
        <RenderErrorBoundary>
          <div data-node-type="module" data-id={mod.id}>
            {/* Render components inside the module */}
            {mod.components?.map(comp => (
              <NodeRenderer key={comp.id} node={{ nodeType: "component", data: comp }} />
            ))}
          </div>
        </RenderErrorBoundary>
      );
    }
    case "component": {
      const comp = node.data as Component;
      // Resolve visual component via registry / factory
      const element = defaultComponentFactory(node, ctx);
      return (
        <RenderErrorBoundary>
          <div data-node-type="component" data-id={comp.id} style={{ position: "relative" }}>
            {element}
            {/* Render nested children if present */}
            {comp.children?.map(child => (
              <NodeRenderer key={child.id} node={{ nodeType: "component", data: child }} />
            ))}
          </div>
        </RenderErrorBoundary>
      );
    }
    default:
      // For any node types we haven't explicitly handled, render a placeholder.
      return (
        <RenderErrorBoundary>
          <div style={{ border: "1px solid #ff4d4f", padding: "4px" }}>
            Unsupported node type: {(node as any).nodeType}
          </div>
        </RenderErrorBoundary>
      );
  }
});

NodeRenderer.displayName = "NodeRenderer";
