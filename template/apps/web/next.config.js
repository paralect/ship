const dotenv = require('dotenv-flow');
const { join } = require('path');

const dotenvConfig = dotenv.config({
  node_env: process.env.NEXT_PUBLIC_APP_ENV,
  silent: true,
});

module.exports = {
  env: dotenvConfig.parsed,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  output: 'standalone',
  experimental: {
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: join(__dirname, '../../'),
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['types', 'schemas', 'app-constants'],
};
