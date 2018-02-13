const Router = require('koa-router');

const router = new Router();
const controller = require('./user.controller');

router.get('/current', controller.getCurrent);
router.put('/current', controller.updateCurrent);

module.exports = router.routes();
