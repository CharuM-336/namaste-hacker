"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMounted } from "@/hooks/use-mounted";
import { THEME_MODES, type ThemeMode } from "@/lib/theme";

const themeLabels: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const themeIcons: Record<ThemeMode, ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeToggle() {
  const mounted = useMounted();
  const { setTheme, theme = "system" } = useTheme();
  const activeTheme = THEME_MODES.includes(theme as ThemeMode)
    ? (theme as ThemeMode)
    : "system";
  const ActiveIcon = themeIcons[activeTheme];

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button aria-label="Change theme" size="icon" variant="ghost">
              <ActiveIcon className="size-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-44 p-1">
        <div className="grid gap-1">
          {THEME_MODES.map((mode) => {
            const Icon = themeIcons[mode];
            const isActive = mounted && activeTheme === mode;

            return (
              <Button
                className="justify-between"
                key={mode}
                onClick={() => setTheme(mode)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {themeLabels[mode]}
                </span>
                {isActive ? <Check className="size-4" /> : null}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
