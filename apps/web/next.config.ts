import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  transpilePackages: ["@home-design-ops/shared"]
};

export default nextConfig;
