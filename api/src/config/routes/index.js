const jwt = require('koa-jwt');

const config = require('config');

const { urlToken, user } = require('infrastructure/middlewares');
const publicRoutes = require('./public');
const authenticatedRoutes = require('./authenticated');

const jwtOptions = {
  secret: config.jwtSecret,
  audience: config.audience,
  issuer: config.issuer,
};

const defineRoutes = (app) => {
  publicRoutes(app);

  app.use(urlToken);
  app.use(jwt(jwtOptions));
  app.use(user);

  authenticatedRoutes(app);
};

module.exports = defineRoutes;
