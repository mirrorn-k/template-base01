// next.config.ts
import type { NextConfig } from "next";

let isProd = process.env.NODE_ENV === "production";
const isAPIProd = process.env.API_ENV;

if (isAPIProd) {
  isProd = isAPIProd === "production";
}

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
