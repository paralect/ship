const webpack = require('webpack');
const koaWebpack = require('koa-webpack');

const webpackConfig = require('../client/webpack.dev.config');

module.exports = (app) => {
  // workaround for docker containers
  const host = process.env.HRM_HOST || 'localhost';

  app.use(koaWebpack({
    compiler: webpack(webpackConfig),
    hot: {
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
      host,
      port: 8081,
    },
    dev: {
      publicPath: webpackConfig.output.publicPath,
    },
  }));
};
