const Joi = require('joi');

const validate = require('middlewares/validate.middleware');
const securityUtil = require('security.util');
const userService = require('resources/user/user.service');
const emailService = require('services/email/email.service');
const config = require('config');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
});

async function validator(ctx, next) {
  const user = await userService.findOne({ email: ctx.validatedData.email });

  if (!user) {
    ctx.body = {};
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx) {
  const { user } = ctx.validatedData;

  let { resetPasswordToken } = user;

  if (!resetPasswordToken) {
    resetPasswordToken = await securityUtil.generateSecureToken();
    await userService.updateOne(
      { _id: user._id },
      (old) => ({ ...old, resetPasswordToken }),
    );
  }

  await emailService.sendForgotPassword(
    user.email,
    {
      firstName: user.firstName,
      resetPasswordUrl: `${config.apiUrl}/account/verify-reset-token?token=${resetPasswordToken}&email=${user.email}`,
    },
  );

  ctx.body = {};
}

module.exports.register = (router) => {
  router.post('/forgot-password', validate(schema), validator, handler);
};
