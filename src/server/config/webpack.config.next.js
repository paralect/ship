// NOTE: exported function is used to extend next.js webpack config

const webpack = require('webpack');

const clientConfig = require('./client');

module.exports = (webpackConfig) => {
  webpackConfig.plugins = webpackConfig.plugins || []; // eslint-disable-line
  webpackConfig.module.rules = webpackConfig.module.rules || []; // eslint-disable-line

  // add support for .pcss files instead of .css
  // eslint-disable-next-line
  webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
    if (rule.test.toString().includes('.css')) {
      return {
        test: /\.pcss$/,
        use: rule.use,
      };
    }

    return rule;
  });

  const webpackConfigPlugin = new webpack.DefinePlugin({
    'process.CLIENT_CONFIG': JSON.stringify(clientConfig),
  });

  webpackConfig.plugins.push(webpackConfigPlugin);

  return webpackConfig;
};
