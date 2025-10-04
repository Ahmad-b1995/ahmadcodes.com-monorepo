import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'woody.tor1.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // env: {
  //   BASE_URL: process.env.BASE_URL || 'http://localhost:3001',
  //   NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  // },
};

export default nextConfig;
