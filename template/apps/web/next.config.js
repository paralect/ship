const path = require('path');

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  output: 'standalone',
  pageExtensions: ['page.tsx', 'api.ts'],
  experimental: {
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Transpile Swagger UI React. https://github.com/swagger-api/swagger-ui/issues/8245
  transpilePackages: ['react-syntax-highlighter', 'swagger-client', 'swagger-ui-react'],
};
