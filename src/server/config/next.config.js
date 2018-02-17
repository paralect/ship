const withCSS = require('@zeit/next-css');

const extendWebackConfig = require('./webpack.config.next.js');
const { resolve } = require('path');
const config = require('./index');


module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    camelCase: true,
  },
  dev: config.isDev,
  webpack: extendWebackConfig,
  dir: resolve('./../../client'),
});
