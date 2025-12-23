// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // ローカル backend
      {
        source: "/local/storage/:path*",
        destination: "http://backend:80/storage/:path*",
      },
      // 本番 backend
      {
        source: "/prod/storage/:path*",
        destination: "https://ma-plus-backend.ttnou.com/storage/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      // ローカル backend（Docker 内）
      {
        protocol: "http",
        hostname: "backend",
        pathname: "/storage/**",
      },
      // 本番 backend
      {
        protocol: "https",
        hostname: "ma-plus-backend.ttnou.com",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
