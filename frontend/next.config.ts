import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      ...(!isProd
        ? [
            {
              source: "/storage/:path*",
              destination: "http://backend:80/storage/:path*",
            },
          ]
        : [
            {
              source: "/storage/:path*",
              destination: "https://ma-plus-backend.ttnou.com/storage/:path*",
            },
          ]),
    ];
  },
  images: {
    // remotePatternsは不要。src="/storage/..." でOK
  },
};

export default nextConfig;
