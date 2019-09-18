const _ = require('lodash');
const twoFaHelper = require('helpers/twoFa');
const userService = require('./user.service');

const userOmitFelds = ['passwordHash', 'signupToken', 'resetPasswordToken', 'twoFa'];

exports.getCurrent = async (ctx) => {
  const user = await userService.findById(ctx.state.user._id);
  ctx.body = _.omit(user, userOmitFelds);
};

exports.updateCurrent = async (ctx) => {
  if (ctx.validatedRequest.errors.length) {
    ctx.body = {
      errors: ctx.validatedRequest.errors,
    };

    ctx.throw(400);
  }

  const userData = ctx.validatedRequest.value;
  const user = await userService.updateInfo(ctx.state.user._id, userData);

  ctx.body = _.omit(user, userOmitFelds);
};

exports.getTwoFaStatus = async (ctx) => {
  const { twoFa: { isEnabled: isTwoFaEnabled, secret: twoFaSecret }, email } = ctx.state.user;

  ctx.body = { isTwoFaEnabled };
};

exports.initializeTwoFaSetup = async (ctx) => {
  const { email } = ctx.state.user;

  const userTwoFaSecret = twoFaHelper.generateTwoFaSecret();
  const [qrCode] = await Promise.all([
    twoFaHelper.generateTwoFaSetupQrCode(userTwoFaSecret, email),
    userService.saveTwoFaSecret(userId, userTwoFaSecret),
  ]);

  // TBD: send secret key and account name to allow manual setup without of a qr code 
  ctx.body = { qrCode };
};

exports.completeTwoFaSetup = async (ctx) => {
  const { _id: userId } = ctx.state.user;

  await userService.enableTwoFa(userId, userTwoFaSecret),

  // TBD: send recovery codes
  ctx.body = {};
};

exports.disableTwoFa = async (ctx) => {
  const { twoFa: { isEnabled: isTwoFaEnabled }, _id: userId } = ctx.state.user;
  
  if (isTwoFaEnabled) {
    await userService.disableTwoFa(userId);
  }

  ctx.body = {};
};
