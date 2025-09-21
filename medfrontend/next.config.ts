import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND: process.env.NEXT_PUBLIC_BACKEND || "/api"
  }
};

export default nextConfig;