import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 is for clouds, whose soft gradients band and smear at the default.
    qualities: [75, 90],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
