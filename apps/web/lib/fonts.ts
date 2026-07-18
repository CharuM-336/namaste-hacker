import { Geist, Source_Serif_4 } from "next/font/google";

export const chromeFont = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const readingFont = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-reading",
});

export const fontVariables = `${chromeFont.variable} ${readingFont.variable}`;
