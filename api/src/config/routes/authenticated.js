const mount = require('koa-mount');
const userResource = require('resources/user');

module.exports = (app) => {
  app.use(mount('/users', userResource));
};
