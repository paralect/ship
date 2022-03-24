const auth = require('./middlewares/auth.middleware');
const tryToAttachUser = require('./middlewares/try-to-attach-user.middleware');
const extractTokens = require('./middlewares/extract-tokens.middleware');
const attachCustomErrors = require('./middlewares/attach-custom-errors.middleware');
const routeErrorHandler = require('./middlewares/route-error-handler.middleware');
const publicRoutes = require('./public');
const authenticatedRoutes = require('./authenticated');

const defineRoutes = (app) => {
  app.use(attachCustomErrors);
  app.use(routeErrorHandler);

  app.use(extractTokens);
  app.use(tryToAttachUser);

  publicRoutes(app);

  app.use(auth);

  authenticatedRoutes(app);
};

module.exports = defineRoutes;
