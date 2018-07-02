const webpack = require('webpack');
const koaWebpack = require('koa-webpack');

const webpackConfig = require('../client/webpack.dev.config');

module.exports = () => {
  // workaround for docker containers
  const host = process.env.HRM_HOST || 'localhost';

  return koaWebpack({
    compiler: webpack(webpackConfig),
    hotClient: {
      host,
      port: 8081,
    },
    devMiddleware: {
      publicPath: webpackConfig.output.publicPath,
    },
  });
};
