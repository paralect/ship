const { join } = require('path');

const postcssImport = require('postcss-import');
const postcssCssNext = require('postcss-cssnext');
const cssnano = require('cssnano');
const postcssNested = require('postcss-nested');
const postcssHexrgba = require('postcss-hexrgba');
const lost = require('lost');

module.exports = {
  plugins: [
    postcssImport({
      root: join(__dirname, 'src/client'),
      path: ['styles'],
    }),
    postcssNested,
    postcssCssNext,
    postcssHexrgba,
    cssnano({
      zindex: false,
    }),
    lost,
  ],
};
