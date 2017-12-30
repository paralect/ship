const _ = require('lodash');

const userService = require('./user.service');
const validators = require('./validators');

const userOmitFelds = ['passwordHash', 'passwordSalt', 'signupToken', 'resetPasswordToken'];

exports.getCurrent = async (ctx, next) => {
  const user = await userService.findById(ctx.state.user._id);
  ctx.body = _.omit(user, userOmitFelds);
};

exports.updateCurrent = async (ctx, next) => {
  const result = await validators.update.validate(ctx);
  ctx.assert(!result.errors, 400);

  const { value: userData } = result;
  const user = await userService.updateInfo(ctx.state.user._id, userData);

  ctx.body = _.omit(user, userOmitFelds);
};
