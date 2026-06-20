import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true, // Ensure this is present
    },
  },
};

module.exports = {
  images: {
    remotePatterns: [
      {
        hostname: "**.public.blob.vercel-storage.com",
        protocol: "https",
        port: "",
        pathname: "/**",
        search: ""
      }
    ],
  }
};
