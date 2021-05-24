const cssLoaderConfig = require('./css-loader-config');

module.exports = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }

      const { dev, isServer } = options;
      const { cssModules, cssLoaderOptions, postcssLoaderOptions } = nextConfig;

      // eslint-disable-next-line no-param-reassign
      options.defaultLoaders.css = cssLoaderConfig(config, {
        extensions: ['pcss'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
      });

      config.module.rules.push({
        test: /\.pcss$/,
        use: options.defaultLoaders.css,
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
};
