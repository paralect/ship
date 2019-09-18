const Router = require('koa-router');
const validate = require('middlewares/validate');
const validators = require('./validators');

const router = new Router();
const controller = require('./user.controller');

router.get('/current', controller.getCurrent);
router.put('/current', validate(validators.update, { throwOnInvalid: false }), controller.updateCurrent);

router.get('/2fa/status', controller.getTwoFaStatus);
router.get('/2fa/setup', validate(validators.initTwoFaSetup), controller.initializeTwoFaSetup);
router.post('/2fa/setup', validate(validators.completeTwoFaSetup), controller.completeTwoFaSetup);
router.post('/2fa/disable', controller.disableTwoFa);

// TBD
// router.post('/2fa/recovery-codes', controller.generateRecoveryCodes);

module.exports = router.routes();
