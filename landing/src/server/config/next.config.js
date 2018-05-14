const withCSS = require('../lib/next-css');

const { resolve } = require('path');
const { apiUrl, webUrl, isDev } = require('./index');

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    camelCase: true,
    localIdentName: '[local]___[hash:base64:5]',
  },
  dev: isDev,
  dir: resolve('./../../client'),
  isServer: true,
  publicRuntimeConfig: {
    apiUrl,
    webUrl,
  },
});
