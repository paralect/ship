const Router = require('@koa/router');

require('./user.handler');

const router = new Router();

require('./get-current').register(router);
require('./update-current').register(router);
require('./upload-avatar').register(router);
require('./remove-avatar').register(router);

require('./list').register(router);

module.exports = router.routes();
