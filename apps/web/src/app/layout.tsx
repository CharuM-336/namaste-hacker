import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { fontVariables } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Folio — Every book deserves its own world",
  description:
    "An immersive reading companion that transforms your books into handcrafted experiences. Upload a book, enter its world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
