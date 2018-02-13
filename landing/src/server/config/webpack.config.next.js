// NOTE: exported function is used to extend next.js webpack config

const webpack = require('webpack');

const clientConfig = require('./client');

module.exports = (webpackConfig) => {
  webpackConfig.plugins = webpackConfig.plugins || []; // eslint-disable-line

  const webpackConfigPlugin = new webpack.DefinePlugin({
    'process.CLIENT_CONFIG': JSON.stringify(clientConfig),
  });

  webpackConfig.plugins.push(webpackConfigPlugin);

  return webpackConfig;
};
