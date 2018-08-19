const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');

const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcssImport({
      root: __dirname,
      path: ['styles'],
    }),
    postcssNested,
    postcssPresetEnv({
      stage: 2,
      features: {
        'custom-media-queries': true,
        'custom-properties': {
          appendVariables: false,
          preserve: false, // use true when will be fixed bug with duplicate root variables
        },
      },
    }),
    cssnano({
      zindex: false,
    }),
  ],
};
