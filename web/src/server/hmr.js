const webpack = require('webpack');
const koaWebpack = require('koa-webpack');

const webpackConfig = require('../client/webpack.dev.config');

module.exports = (app) => {
  app.use(koaWebpack({
    compiler: webpack(webpackConfig),
    hot: {
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    },
    dev: {
      publicPath: webpackConfig.output.publicPath,
    },
  }));
};
