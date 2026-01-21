import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  sassOptions: {
    includePaths: [__dirname + '/src/styles/variables']
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
  }
};

const withNextIntl = createNextIntlPlugin();

// Conditionally add bundle analyzer when ANALYZE env var is set
let config = withNextIntl(nextConfig);
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
    analyzerMode: 'static',
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: ({ name }: { name: string }) => `stats-${name}.json`,
    reportFilename: ({ name }: { name: string }) => `${name}.html`,
  });
  config = withBundleAnalyzer(config);
}

export default config;