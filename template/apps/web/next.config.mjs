import { withContentCollections } from '@content-collections/next';
import dotenv from 'dotenv-flow';
import { join } from 'node:path';
import process from 'node:process';

const dotenvConfig = dotenv.config({
  node_env: process.env.NEXT_PUBLIC_APP_ENV,
  silent: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: dotenvConfig.parsed,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Ensure symlinked plugin files resolve bare imports (components, hooks, etc.)
    // and node_modules from the web app, not from the plugin's real path.
    const webSrc = join(process.cwd(), 'src');
    const webNodeModules = join(process.cwd(), 'node_modules');
    config.resolve.modules = [webSrc, webNodeModules, ...config.resolve.modules || ['node_modules']];

    return config;
  },
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: join(process.cwd(), '../../'), // this includes files from the monorepo base two directories up
  pageExtensions: ['page.tsx', 'api.ts'],
  transpilePackages: ['app-constants', 'schemas', 'types'],
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
};

export default withContentCollections(nextConfig);
