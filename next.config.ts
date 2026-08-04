// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "templedb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.templedb.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
