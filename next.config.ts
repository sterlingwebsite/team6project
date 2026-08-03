// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [60, 75], // 🧠 Fixed: Explicit array values provided to bypass syntax parser crash
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
