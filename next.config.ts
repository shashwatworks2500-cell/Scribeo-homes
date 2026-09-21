import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* No immutable cache header any more. Nothing lives under /hero/ since the
     frame sequence was removed, and the still at /hero-still/ deliberately
     does NOT get one: it sits at a stable filename, so pinning it for a year
     is exactly how a replacement photograph would fail to reach anyone who
     had already visited — the bug that put two films in the hero at once.
     Next's default revalidation is right here, and next/image caches its own
     derivatives by content hash regardless. */
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2048],
  },
};

export default nextConfig;
