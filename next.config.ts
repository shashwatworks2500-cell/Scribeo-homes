import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2048],
  },
  async headers() {
    return [
      {
        /* Safe because the path carries a revision (HERO_REV in lib/assets).
           The frame names themselves are positional, not content-addressed,
           so without that segment `immutable` pins one encode's bytes under
           names the next encode reuses — and the hero plays two films at
           once for anyone who visited before. Bump the revision, never
           overwrite a path. */
        source: "/hero/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
