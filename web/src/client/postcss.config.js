const postcssImport = require('postcss-import');
const postcssCssNext = require('postcss-cssnext');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcssImport({
      root: __dirname,
      path: ['styles'],
    }),
    postcssCssNext,
    cssnano({
      zindex: false,
    }),
  ],
};
