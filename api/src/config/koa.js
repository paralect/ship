const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const validate = require('koa-validate');
const requestLogger = require('koa-logger');
const qs = require('koa-qs');

const logger = require('logger');

const routes = require('./routes');

const routeErrorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status || 500;

    if (!ctx.body) {
      ctx.body = {
        errors: {
          _global: [error.message],
        },
      };
    }

    logger.error(ctx.body);
  }
};

module.exports = (app) => {
  app.use(cors({ credentials: true }));
  app.use(helmet());
  qs(app);
  app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }));
  app.use(requestLogger());

  validate(app);

  app.use(routeErrorHandler);

  routes(app);
};
