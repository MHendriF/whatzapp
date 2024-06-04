/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scintillating-bulldog-402.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
