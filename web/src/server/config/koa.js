const path = require('path');
const requestLogger = require('koa-logger');
const serve = require('koa-static');
const mount = require('koa-mount');
const views = require('koa-views');
const session = require('koa-generic-session');
const handlebars = require('handlebars');

const config = require('config');

const redisStore = require('koa-redis')(config.session.store);

const { logger } = global;

const routes = require('./routes');
const hmr = require('../hmr');

const pathToViews = path.join(__dirname, './../../client/views');
const pathToStatic = path.join(__dirname, './../../client/static');
handlebars.registerHelper('json', context => JSON.stringify(context));

module.exports = async (app) => {
  app.use(requestLogger());
  app.use(views(config.isDev ? pathToViews : pathToStatic, {
    default: 'html',
    map: { html: 'handlebars' },
    options: {
      helpers: {
        json: ctx => JSON.stringify(ctx),
      },
    },
  }));

  if (config.isDev) {
    const middleware = await hmr();
    app.use(middleware);
  } else {
    app.use(mount('/static', serve(pathToStatic)));
  }

  app.keys = [config.session.secret]; // eslint-disable-line
  app.use(session({
    store: redisStore,
    ttl: config.session.ttl,
  }));

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error(err);
      this.status = err.status || 500;
      this.body = {
        errors: [{ _global: 'An error has occurred' }],
      };
    }
  });

  app.use(routes);
};
