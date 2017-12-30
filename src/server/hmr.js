const webpack = require('webpack');
const koaWebpack = require('koa-webpack');

const webpackConfig = require('../client/webpack.dev.config');

module.exports = (app) => {
  app.use(koaWebpack({
    compiler: webpack(webpackConfig),
    hot: {},
    dev: {
      publicPath: webpackConfig.output.publicPath,
    },
  }));
};
