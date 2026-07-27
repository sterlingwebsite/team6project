import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "templedb.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
