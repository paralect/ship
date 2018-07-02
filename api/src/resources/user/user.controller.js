const _ = require('lodash');
const userService = require('./user.service');

const userOmitFelds = ['passwordHash', 'passwordSalt', 'signupToken', 'resetPasswordToken'];

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
