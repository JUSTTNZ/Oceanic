// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow any host
        pathname: "/**", // allow any path
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://oceanic-servernz.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
