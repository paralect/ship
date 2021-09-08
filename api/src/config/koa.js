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
    const status = error.status || 500;
    const errors = error.errors || error.message;

    ctx.status = status;
    ctx.body = process.env.APP_ENV === 'production'
      ? { errors: error.errors || { _global: ['Something went wrong.'] } }
      : { errors: error.errors || { _global: [error.message] } };

    logger.error(errors);
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
