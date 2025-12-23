// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // ローカル backend
      {
        source: "/storage/:path*",
        destination: "http://backend:80/storage/:path*",
      },
      // 本番 backend
      {
        source: "/storage/:path*",
        destination: "https://ma-plus-backend.ttnou.com/storage/:path*",
      },
    ];
  },
  images: {
    // src="/storage/..." を使う前提
  },
};

export default nextConfig;
