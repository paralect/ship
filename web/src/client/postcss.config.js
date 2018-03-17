const postcssImport = require('postcss-import');
const postcssCssNext = require('postcss-cssnext');
const cssnano = require('cssnano');
const postcssNested = require('postcss-nested');

module.exports = {
  plugins: [
    postcssImport({
      root: __dirname,
      path: ['styles'],
    }),
    postcssNested,
    postcssCssNext,
    cssnano({
      zindex: false,
    }),
  ],
};
