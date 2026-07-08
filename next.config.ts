import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const nextConfig: NextConfig = {
  output: "export",
  // Note: rewrites() are not supported when output is "export".
  // API calls must be made directly to NEXT_PUBLIC_API_BASE_URL.
};

export default nextConfig;
