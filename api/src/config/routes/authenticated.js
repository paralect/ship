const mount = require('koa-mount');

const userResource = require('resources/user');
const fileResource = require('resources/file');

module.exports = (app) => {
  app.use(mount('/users', userResource));
  app.use(mount('/files', fileResource));
};
