const { join } = require('path');

const postcssImport = require('postcss-import');
const postcssCssNext = require('postcss-cssnext');
const cssnano = require('cssnano');
const lost = require('lost');

module.exports = {
  plugins: [
    postcssImport({
      root: join(__dirname, 'src/client'),
      path: ['styles'],
    }),
    postcssCssNext,
    cssnano({
      zindex: false,
    }),
    lost,
  ],
};
