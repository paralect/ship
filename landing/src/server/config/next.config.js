const extendWebackConfig = require('./webpack.config.next.js');
const { resolve } = require('path');
const config = require('./index');

module.exports = {
  dev: config.isDev,
  webpack: extendWebackConfig,
  dir: resolve('./../../client'),
};
