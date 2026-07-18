import Link from "next/link";

import { CommandTrigger } from "@/components/navigation/command-trigger";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  APP_NAME,
  PRIMARY_NAVIGATION_ITEMS,
  PRODUCT_MARK_ICON,
  SETTINGS_NAVIGATION_ITEM,
} from "@/lib/constants";

export function TopNavigation() {
  const ProductMarkIcon = PRODUCT_MARK_ICON;
  const SettingsIcon = SETTINGS_NAVIGATION_ITEM.icon;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="flex size-9 items-center justify-center rounded-md border border-border bg-surface text-primary shadow-hairline">
            <ProductMarkIcon className="size-4" />
          </span>
          <span className="truncate text-sm font-semibold tracking-[0.08em] uppercase">
            {APP_NAME}
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {PRIMARY_NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Button asChild key={item.href} variant="ghost">
                <Link href={item.href}>
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <CommandTrigger />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild aria-label="Settings" size="icon" variant="ghost">
                <Link href={SETTINGS_NAVIGATION_ITEM.href}>
                  <SettingsIcon className="size-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{SETTINGS_NAVIGATION_ITEM.label}</TooltipContent>
          </Tooltip>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
