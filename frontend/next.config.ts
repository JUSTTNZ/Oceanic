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
    {
        protocol: "https",
        hostname: "lgz.ru", // ✅ fix this
      },
       {
        protocol: 'https',
        hostname: 'media.assettype.com',
        port: '',
        pathname: '/**',  // allow any path
      },
      {
        protocol: 'https',
        hostname: 'ffnews.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.bytvi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'analyticsinsight.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'businesstimes.com.sg',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.analyticsinsight.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.businesstimes.com.sg',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ffnews.com',
        port: '',
        pathname: '/**',
      },
{
  protocol: 'https',
  hostname: 'dam.mediacorp.sg',
  port: '',
  pathname: '/**',
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