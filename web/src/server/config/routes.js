const config = require('config');
const indexRouter = require('koa-router')();

// match all routes but not files (i.e. routes with dots)
indexRouter.get(/^((?!\.).)*$/, async (ctx) => {
  const data = {
    config: {
      apiUrl: config.apiUrl,
    },
  };

  return ctx.render(config.isDev ? 'index-dev' : 'index', data);
});

module.exports = indexRouter.routes();
