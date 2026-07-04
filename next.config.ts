import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a fully static site in ./out for GitHub Pages (no server runtime).
  output: "export",
  // GitHub Pages can't run Next.js image optimization; use raw <img> tags.
  images: { unoptimized: true },
  // Emit each route as a folder with index.html for clean static hosting.
  trailingSlash: true,
};

export default nextConfig;
