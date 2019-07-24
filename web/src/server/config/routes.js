const axios = require('axios');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const config = require('config');

const { logger } = global;

const indexRouter = new Router();

const signinUrl = `${config.landingUrl}/signin`;
const apiUrl = config.apiInternalUrl || config.apiUrl;

indexRouter.get('/logout', async (ctx) => {
  ctx.session = null;
  ctx.redirect(signinUrl);
  ctx.body = {};
});

// match all routes but not files (i.e. routes with dots)
indexRouter.get(/^((?!\.).)*$/, async (ctx) => {
  const data = {
    isDev: config.isDev,
    config: {
      apiUrl: config.apiUrl,
    },
    user: {},
    token: '',
  };

  const jwtOptions = _.pick(config.jwt, ['audience', 'issuer']);

  try {
    if (ctx.query.token && jwt.verify(ctx.query.token, config.jwt.secret, jwtOptions)) {
      ctx.session.token = ctx.query.token;
      ctx.redirect(ctx.path);
    }
  } catch (error) {
    ctx.session.token = null;
    logger.error(error);
    ctx.redirect(signinUrl);
    return null;
  }

  try {
    if (ctx.session.token && jwt.verify(ctx.session.token, config.jwt.secret, jwtOptions)) {
      const response = await axios.get(`${apiUrl}/users/current`, {
        responseType: 'json',
        headers: { Authorization: `Bearer ${ctx.session.token}` },
      });

      data.user = response.data;
      data.token = ctx.session.token;
    } else {
      ctx.session.token = null;
      ctx.redirect(signinUrl);
      return null;
    }
  } catch (error) {
    ctx.session.token = null;
    logger.error(error);
    ctx.redirect(signinUrl);
    return null;
  }

  return ctx.render('index', data);
});

module.exports = indexRouter.routes();
