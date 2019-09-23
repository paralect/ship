const Router = require('koa-router');
const validate = require('middlewares/validate');
const validators = require('./validators');

const router = new Router();
const controller = require('./account.controller');
const googleController = require('./google/google.controller');

router.post('/signup', validate(validators.signup), controller.signup);
router.get('/verifyEmail/:token', validate(validators.verifyEmail), controller.verifyEmail);
router.post('/signin', validate(validators.signin), controller.signin);
router.post('/forgotPassword', validate(validators.forgotPassword), controller.forgotPassword);
router.put('/resetPassword', validate(validators.resetPassword), controller.resetPassword);
router.post('/resend', controller.resendVerification);

router.get('/signin/google/auth', googleController.getOAuthUrl);
router.get('/signin/google', googleController.signinGoogleWithCode);

router.get('/auth/facebook', controller.handleOauth('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', controller.handleOauthCallback('facebook'));

module.exports = router.routes();
