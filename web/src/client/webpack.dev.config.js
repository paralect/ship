const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    main: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './index.jsx',
    ],
  },

  output: {
    path: `${__dirname}/static/`,
    publicPath: '/static/',
    filename: '[name].js',
  },

  context: path.resolve(__dirname, './'),

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.pcss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },

  devtool: 'eval',

  resolve: {
    modules: ['./', 'node_modules'],
    extensions: ['.js', '.jsx', '.pcss'],
  },

  plugins: [new webpack.NoEmitOnErrorsPlugin()],
};
