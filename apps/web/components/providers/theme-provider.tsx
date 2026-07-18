"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import type { ComponentType, PropsWithChildren } from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme";

type AppThemeProviderProps = PropsWithChildren<ThemeProviderProps>;
type NextThemesProviderWithChildren = ComponentType<AppThemeProviderProps>;

const Provider = NextThemesProvider as NextThemesProviderWithChildren;

export function ThemeProvider({ children, ...props }: AppThemeProviderProps) {
  return (
    <Provider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      storageKey={THEME_STORAGE_KEY}
      {...props}
    >
      {children}
    </Provider>
  );
}
