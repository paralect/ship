const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const validate = require('koa-validate');
const requestLogger = require('koa-logger');

const { logger } = global;
const routes = require('./routes');

const getArray = (obj) => {
  if (!obj) {
    return [];
  }

  if (obj instanceof Array) {
    return obj;
  }

  return [obj];
};

const routeErrorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.status < 400 || ctx.status >= 500) {
      logger.error(err);
      ctx.body = {
        errors: [{ _global: 'An error has occurred' }],
      };
      ctx.app.emit('error', err, ctx);
    } else {
      const errors = getArray(ctx.errors);

      const { message } = err;
      const messages = Object.keys(err).map(key => ({ [key]: err[key] }));

      if (!ctx.body) {
        if (errors.length + messages.length) {
          ctx.body = {
            errors: [...errors, ...messages],
          };
        } else {
          ctx.body = message;
        }
      }

      logger.error(ctx.body);
    }
  }
};

module.exports = (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }));
  app.use(requestLogger());

  validate(app);

  app.use(routeErrorHandler);

  routes(app);
};
