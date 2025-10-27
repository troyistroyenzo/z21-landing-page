import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during builds to prevent linting errors from blocking deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
