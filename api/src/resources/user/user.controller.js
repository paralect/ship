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
  const { twoFa: { isEnabled: isTwoFaEnabled } } = ctx.state.user;

  ctx.body = { isTwoFaEnabled };
};

exports.initializeTwoFaSetup = async (ctx) => {
  const { email, _id: userId } = ctx.state.user;
  const accountName = twoFaHelper.generateAccountName(email);

  let { twoFa: { secret } } = ctx.state.user;

  if (!secret) {
    secret = twoFaHelper.generateSecret(accountName);

    await userService.saveTwoFaSecret(userId, secret);
  }

  const qrCode = await twoFaHelper.generateQrCode(secret, accountName);

  ctx.body = { qrCode, key: secret, account: accountName };
};

exports.verifyTwoFaSetup = async (ctx) => {
  const { _id: userId } = ctx.state.user;

  await userService.enableTwoFa(userId);

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
