import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pages usually hosts at /repository-name/
  basePath: '/nhh-imt',
  assetPrefix: '/nhh-imt',
};

export default nextConfig;
