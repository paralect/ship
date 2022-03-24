const Router = require('@koa/router');

const router = new Router();

require('./sign-up').register(router);
require('./sign-in').register(router);
require('./sign-out').register(router);
require('./verify-email').register(router);
require('./forgot-password').register(router);
require('./reset-password').register(router);
require('./verify-reset-token').register(router);
require('./resend-email').register(router);

module.exports = router.routes();
