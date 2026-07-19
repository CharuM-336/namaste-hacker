import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfjs-dist uses Node.js-only APIs; keep it out of the browser bundle
  serverExternalPackages: ["pdfjs-dist"],

  // Turbopack alias — prevents browser bundle from trying to load the native canvas module
  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.ts",
    },
  },
};

export default nextConfig;
