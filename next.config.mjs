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
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    turbo: {
      loaders: {
        ".svg": ["@svgr/webpack"],
      },
    },
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.replit.app", "*.replit.dev"],
    },
    serverComponentsExternalPackages: ["prisma", "@prisma/client"],
    webVitalsAttribution: ["CLS", "LCP", "FCP", "FID", "TTFB"],
  },

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,

  // Webpack optimizations
  webpack: (config, { dev, isServer, webpack }) => {
    // Optimize for development
    if (dev && !isServer) {
      config.watchOptions = {
        poll: false,
        ignored: /node_modules/,
      };
    }

    // Production optimizations
    if (!dev) {
      // Bundle analyzer
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      );

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Split chunks optimization
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            priority: -30,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Optimize bundle splitting
    if (config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups.react = {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: "react",
        chunks: "all",
        priority: 20,
      };
    }

    return config;
  },

  // Optimize output
  output: "standalone",

  // Compress responses
  compress: true,

  // Power optimizations for Vercel
  poweredByHeader: false,
};

export default nextConfig;
