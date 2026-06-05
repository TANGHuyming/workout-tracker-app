import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true, // Ensure this is present
    },
  },
  cacheComponents: true,
};

export default nextConfig;   