const path = require('path');

module.exports = {
  core: {
    builder: "webpack5",
  },
  webpackFinal: (config) => {
    config.module.rules.push({
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
      include: path.resolve(__dirname, '../'),
    });

    const rule = config.module.rules.find(({ test }) => test.test(".svg"));
    
    // replace default storybook svg loader
    rule.test = /\.(ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
  
    config.module.rules.unshift({
      test: /\.svg$/,
      loader: 'svg-react-loader'
    });

    return config;
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ]
};
