import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone', // Enable standalone output for Docker production
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // PWA Configuration
  experimental: {
    // Enable PWA features
    optimizePackageImports: ['@heroui/react'],
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // Headers for PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https", // یا 'http' بسته به پروتکل استفاده شده
        hostname: "file-dev.ramooz.org", // نام دامنه
        pathname: "/**", // این الگو برای انتخاب تمامی مسیرها استفاده می‌شود
      },
    ],
    // Optimize images for PWA
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Webpack configuration for PWA
  webpack: (config, { dev, isServer }) => {
    // Optimize for PWA
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  turbopack: {
    rules: {
      "*.scss": {
        loaders: ["sass-loader"],
        as: "*.css",
      },
    },
  },
  
  // Redirects for PWA
  async redirects() {
    return [
      {
        source: '/offline',
        destination: '/offline.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
