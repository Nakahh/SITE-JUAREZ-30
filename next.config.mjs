/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Reduce bundle size
  experimental: {
    optimizeCss: true,
    turbo: {
      loaders: {
        ".svg": ["@svgr/webpack"],
      },
    },
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.replit.app", "*.replit.dev"],
    },
  },

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.replit.app",
      },
    ],
  },

  // Disable source maps in development for faster builds
  productionBrowserSourceMaps: false,

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: false,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;
