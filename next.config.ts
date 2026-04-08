import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.shopify.com" },
      { protocol: "http", hostname: "petzifyco.local" },
      { protocol: "https", hostname: "petzify.co" },
    ],
  },
  compress: true,
};

export default nextConfig;
