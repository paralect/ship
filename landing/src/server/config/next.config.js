const { resolve } = require('path');

const withCSS = require('../lib/next-css');

const {
  apiUrl,
  isDev,
  gaTrackingId,
} = require('./index');

const config = {
  dev: isDev,
  dir: resolve('./../../client'),
  isServer: true,
  publicRuntimeConfig: {
    apiUrl,
    gaTrackingId,
  },

  cssModules: true,
  cssLoaderOptions: {
    localsConvention: 'camelCase',
    modules: {
      localIdentName: '[local]_[hash:base64:5]',
    },
  },
};

module.exports = withCSS(config);
