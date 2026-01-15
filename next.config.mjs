/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // IMAGE OPTIMIZATION
  // ============================================================================
  images: {
    remotePatterns: [
      // Unsplash - High-quality stock photos
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Unsplash Plus CDN
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      // GitHub Raw - For hosted assets
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      // Supabase Storage - Wildcard for any project
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Supabase Storage - Direct subdomain pattern
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
    ],
    // Image formats to use
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
  },

  // ============================================================================
  // EXPERIMENTAL FEATURES
  // ============================================================================
  experimental: {
    // Enable Server Actions (stable in Next.js 14+)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ============================================================================
  // TYPESCRIPT
  // ============================================================================
  typescript: {
    // Set to true to ignore TypeScript errors during build (not recommended)
    ignoreBuildErrors: false,
  },

  // ============================================================================
  // HEADERS - Security & Caching
  // ============================================================================
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // ============================================================================
  // REDIRECTS
  // ============================================================================
  async redirects() {
    return [
      // Redirect old routes if needed
      {
        source: '/signup',
        destination: '/login',
        permanent: false,
      },
    ];
  },

  // ============================================================================
  // LOGGING
  // ============================================================================
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;

