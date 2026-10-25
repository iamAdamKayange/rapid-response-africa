import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Editors paste image URLs from any host (Unsplash, Cloudinary, their own CDN…).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
