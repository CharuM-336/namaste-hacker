// src/index.tsx
import React, { Suspense } from "react";
import { parseBlueprint } from "./BlueprintParser";
import { RenderProvider } from "./RenderContext";
import { NodeRenderer } from "./NodeRenderer";
import { defaultRegistry } from "./Registry";
import { LoadingSpinner } from "./components/LoadingSpinner";
import type { Blueprint } from "./types";

/**
 * Render a Website Blueprint JSON into a React element tree.
 */
export function render(blueprintJson: unknown, options?: { debug?: boolean }): React.ReactElement {
  const blueprint: Blueprint = parseBlueprint(blueprintJson);
  return (
    <RenderProvider registry={defaultRegistry} options={options}>
      <Suspense fallback={<LoadingSpinner />}>
        <NodeRenderer node={{ nodeType: "world", data: blueprint.world }} />
      </Suspense>
    </RenderProvider>
  );
}
