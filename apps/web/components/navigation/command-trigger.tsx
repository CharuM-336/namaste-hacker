import { Command } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CommandTrigger() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label="Open command palette"
          className="hidden gap-2 px-3 md:inline-flex"
          type="button"
          variant="outline"
        >
          <Command className="size-4" />
          <span>Command</span>
          <kbd className="rounded-xs border border-border bg-surface px-1.5 py-0.5 font-sans text-[0.6875rem] text-muted-foreground">
            Ctrl K
          </kbd>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Command palette placeholder</TooltipContent>
    </Tooltip>
  );
}
