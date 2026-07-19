import { EB_Garamond, Geist, Source_Serif_4 } from "next/font/google";

export const chromeFont = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const readingFont = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-reading",
});

export const displayFont = EB_Garamond({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const fontVariables = `${chromeFont.variable} ${readingFont.variable} ${displayFont.variable}`;
