const Router = require('koa-router');
const validate = require('middlewares/validate');
const validators = require('./validators');

const router = new Router();
const controller = require('./user.controller');

router.get('/current', controller.getCurrent);
router.put('/current', validate(validators.update, { throwOnInvalid: false }), controller.updateCurrent);

module.exports = router.routes();
