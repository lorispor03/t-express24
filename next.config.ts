import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gzip/Brotli compression
  compress: true,

  // Remove X-Powered-By header
  poweredByHeader: false,

  // Hide Next.js dev indicator
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },

  // Prefer modern image formats
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.wpassets-gamma.com',
        pathname: '/**',
      },
    ],
  },

  // Cache headers for static assets
  async headers() {
    return [
      {
        // Public static files (logos, images, icons)
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Versioned bundle images
        source: '/bundle-step:num.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Team logos
        source: '/teams/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // League logos
        source: '/leagues/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
