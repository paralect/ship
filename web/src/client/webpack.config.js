const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const incstr = require('incstr');

const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789',
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = nextId;

    return index[name];
  };
};

const uniqueIdGenerator = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath
    .split('/')
    .slice(-5, -1)
    .join('/');
  return `${uniqueIdGenerator(componentName)}_${uniqueIdGenerator(localName)}`;
};

module.exports = {
  mode: 'production',

  entry: {
    main: ['babel-polyfill', './index.jsx'],
  },

  output: {
    path: `${__dirname}/static/`,
    publicPath: '/static/',
    filename: '[name].[hash].js',
  },

  context: path.resolve(__dirname, './'),

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'react-css-modules',
              {
                generateScopedName,
                webpackHotModuleReloading: false,
              },
            ],
          ],
        },
      },
      {
        test: /\.pcss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              camelCase: true,
              getLocalIdent: (context, localIdentName, localName) => {
                return generateScopedName(localName, context.resourcePath);
              },
              minimize: true,
              modules: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url-loader?limit=5000&name=[name].[hash].[ext]?'],
      },
    ],
  },

  devtool: 'source-map',

  resolve: {
    modules: ['./', 'node_modules'],
    extensions: ['.js', '.jsx', '.pcss'],
    alias: {
      joi: 'joi-browser',
    },
  },

  optimization: {
    minimize: true,
  },

  plugins: [
    new MiniCssExtractPlugin({ chunkFilename: '[name].[hash].css' }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BABEL_ENV: JSON.stringify('production'),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'views/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};
