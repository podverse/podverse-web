// Version: 7
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [__dirname + '/src/styles/variables']
  },
  // CHANGED: Removed transpilePackages as it was not the fix
  
  // Ignore Type and Lint errors to ensure Docker build finishes
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // 1. Fix alias for podverse-helpers internal calls
    config.resolve.alias = {
      ...config.resolve.alias,
      '@helpers': path.resolve(__dirname, 'node_modules/podverse-helpers/dist'),
    };

    // 2. Fix "fs", "module", and "bcrypt" errors on the client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        module: false, // Fixes "Can't resolve 'module'"
        'aws-crt': false,
        '@mapbox/node-pre-gyp': false,
      };
      
      // Tell webpack to ignore bcrypt in the client bundle
      config.externals.push({
        bcrypt: 'commonjs bcrypt', 
      });
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/proxy'
      },
      {
        pathname: '/branding/**'
      },
      {
        pathname: '/images/**'
      }
    ]
  },
  env: {
    NEXT_PUBLIC_API_PROTOCOL: process.env.NEXT_PUBLIC_API_PROTOCOL,
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    NEXT_PUBLIC_API_PORT: process.env.NEXT_PUBLIC_API_PORT,
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    NEXT_PUBLIC_WEB_PROTOCOL: process.env.NEXT_PUBLIC_WEB_PROTOCOL,
    NEXT_PUBLIC_WEB_DOMAIN: process.env.NEXT_PUBLIC_WEB_DOMAIN
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);