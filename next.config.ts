import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@prisma/adapter-pg", "@prisma/client", "pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },
  allowedDevOrigins: ["bonded-galley-crablike.ngrok-free.dev", "192.168.0.102"],
};

export default nextConfig;