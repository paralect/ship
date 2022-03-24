const Router = require('@koa/router');

const router = new Router();

require('./get').register(router);

module.exports = router.routes();
