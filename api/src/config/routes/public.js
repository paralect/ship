const mount = require('koa-mount');
const accountResource = require('resources/account/public');

module.exports = (app) => {
  app.use(mount('/account', accountResource));
};
