const mount = require('koa-mount');
const userResource = require('resources/user/authenticated');

module.exports = (app) => {
  app.use(mount('/users', userResource));
};
