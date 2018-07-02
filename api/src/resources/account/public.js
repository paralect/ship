const Router = require('koa-router');
const validate = require('middlewares/validate');
const validators = require('./validators');

const router = new Router();
const controller = require('./account.controller');

router.post('/signup', validate(validators.signup), controller.signup);
router.get('/verifyEmail/:token', validate(validators.verifyEmail), controller.verifyEmail);
router.post('/signin', validate(validators.signin), controller.signin);
router.post('/forgotPassword', validate(validators.forgotPassword), controller.forgotPassword);
router.put('/resetPassword', validate(validators.resetPassword), controller.resetPassword);
router.post('/resend', controller.resendVerification);

module.exports = router.routes();
