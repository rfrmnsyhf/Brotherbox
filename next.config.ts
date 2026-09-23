import type { NextConfig } from "next";

// Static export -> Cloudflare Pages. No server runtime, no image optimizer.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
