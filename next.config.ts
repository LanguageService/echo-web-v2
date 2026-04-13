import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination:
          "https://echo-v1-backend-git-main-suave-lads-projects.vercel.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
