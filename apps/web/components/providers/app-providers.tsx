"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider defaultTheme="light" enableSystem={false}>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
}
