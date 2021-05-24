const Router = require('@koa/router');

const router = new Router();

require('./signup').register(router);
require('./logout').register(router);
require('./verify-email').register(router);
require('./signin').register(router);
require('./forgot-password').register(router);
require('./reset-password').register(router);
require('./resend-verification').register(router);

require('./google').register(router);

module.exports = router.routes();
