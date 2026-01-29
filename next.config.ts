import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Disable React Strict Mode (CRITICAL)
  reactStrictMode: false,

  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Compilation Performance Optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize bundling
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
    ],
  },
  
  // SEO and Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Security and SEO headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // Configuration for Netlify deployment
  serverExternalPackages: ['@genkit-ai/googleai', 'genkit'],
  
  // Turbopack configuration - set root directory to silence warning
  turbopack: {
    root: process.cwd(),
  },
  
  // Mark @react-pdf/renderer as external for webpack
  webpack: (config, { isServer }) => {
    // Enable caching for faster rebuilds
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    };
    
    // Optimize module resolution
    config.resolve.symlinks = false;
    
    if (isServer) {
      config.externals = [...(config.externals || []), '@react-pdf/renderer'];
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    
    // Configure pdfjs-dist worker for client-side
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Ensure pdfjs-dist worker is available
        'pdfjs-dist': require.resolve('pdfjs-dist'),
      };
    }
    
    // Optimize build performance
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          lib: {
            test: /node_modules\/(react|react-dom)/,
            name: 'lib',
            chunks: 'all',
            priority: 10,
          },
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 5,
          },
        },
      },
    };
    
    return config;
  },
  
  // Image optimization for better SEO and performance
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
