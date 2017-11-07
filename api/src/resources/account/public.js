const Router = require('koa-router');

const router = new Router();
const controller = require('./account.controller');

router.post('/signup', controller.signup);
router.get('/verifyEmail/:token', controller.verifyEmail);
router.post('/signin', controller.signin);
router.post('/forgotPassword', controller.forgotPassword);
router.put('/resetPassword', controller.resetPassword);
router.post('/resend', controller.resendVerification);

module.exports = router.routes();
