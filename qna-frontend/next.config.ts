import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SERVER_ENDPOINT: process.env.SERVER_ENDPOINT,
  },
  /* config options here */
};

export default nextConfig;
