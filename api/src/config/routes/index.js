const jwt = require('koa-jwt');

const config = require('config');

const { urlToken, user } = require('./middlewares');
const publicRoutes = require('./public');
const authenticatedRoutes = require('./authenticated');

const defineRoutes = (app) => {
  publicRoutes(app);

  app.use(urlToken);
  app.use(jwt(config.jwt));
  app.use(user);

  authenticatedRoutes(app);
};

module.exports = defineRoutes;
