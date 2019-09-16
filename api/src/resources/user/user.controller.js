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

exports.getTwoFaState = async (ctx) => {
  const { twoFa: { isEnabled: isTwoFaEnabled, secret: twoFaSecret }, email } = ctx.state.user;
  const response = { isTwoFaEnabled };

   if (isTwoFaEnabled) {
    response.qrCode = await twoFaHelper.generateTwoFaQrCode(twoFaSecret, email);
  }

   ctx.body = response;
};

 exports.switchTwoFaState = async (ctx) => {
  const { twoFa: { isEnabled: isTwoFaEnabled }, _id: userId, email } = ctx.state.user;
  const response = { isTwoFaEnabled: !isTwoFaEnabled };

   if (isTwoFaEnabled) {
    await userService.disableTwoFa(userId);
  } else {
    const userTwoFaSecret = twoFaHelper.generateTwoFaSecret();
    const [qrCode] = await Promise.all([
      twoFaHelper.generateTwoFaQrCode(userTwoFaSecret, email),
      userService.enableTwoFa(userId, userTwoFaSecret),
    ]);

     response.qrCode = qrCode;
  }

   ctx.body = response;
};
