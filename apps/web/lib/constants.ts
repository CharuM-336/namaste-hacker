import type { LucideIcon } from "lucide-react";
import { BookOpenText, Library, Settings, Upload } from "lucide-react";

export type NavigationItem = Readonly<{
  label: string;
  href: string;
  icon: LucideIcon;
}>;

export const APP_NAME = "Namaste Hacker";

export const APP_DESCRIPTION =
  "An AI-native reading platform for interactive, personalized book experiences.";

export const PRIMARY_NAVIGATION_ITEMS = [
  {
    label: "Library",
    href: "/library",
    icon: Library,
  },
  {
    label: "Upload",
    href: "/upload",
    icon: Upload,
  },
] as const satisfies readonly NavigationItem[];

export const SETTINGS_NAVIGATION_ITEM = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
} as const satisfies NavigationItem;

export const PRODUCT_MARK_ICON = BookOpenText;
