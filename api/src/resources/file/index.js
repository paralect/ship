const Router = require('@koa/router');

const router = new Router();

require('./upload').register(router);
require('./get-download-url').register(router);

module.exports = router.routes();
