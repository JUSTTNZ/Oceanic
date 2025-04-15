import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/coins/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        pathname: '/logos/**',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com', // Add this entry
        pathname: '/coins/images/**',
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", 
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://oceanic-servernz.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;