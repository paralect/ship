const withCSS = require('../lib/next-css');

const extendWebackConfig = require('./webpack.config.next.js');
const { resolve } = require('path');
const config = require('./index');

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    camelCase: true,
    localIdentName: '[local]___[hash:base64:5]',
  },
  dev: config.isDev,
  webpack: extendWebackConfig,
  dir: resolve('./../../client'),
  isServer: true,
});
