const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const env = process.env.APP_ENV || 'development';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3002;

module.exports = {
  mode: 'development',
  target: 'web',

  entry: {
    main: './src/index.jsx',
  },

  devServer: {
    host,
    port,
    contentBase: path.resolve(__dirname, 'src/static'),
    watchContentBase: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    compress: true,
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-refresh/babel'],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.pcss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]_[hash:8]',
              },
            },
          },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2|ttf|eot)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[contenthash].[ext]',
            },
          },
        ],
      },
    ],
  },

  devtool: 'eval-source-map',

  resolve: {
    extensions: ['.mjs', '.js', '.jsx'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        APP_ENV: JSON.stringify(env),
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'src/static/index.html'),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
};
