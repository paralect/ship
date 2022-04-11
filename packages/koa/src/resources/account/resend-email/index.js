const Joi = require('joi');

const validate = require('middlewares/validate.middleware');
const userService = require('resources/user/user.service');
const emailService = require('services/email/email.service');
const securityUtil = require('security.util');

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
  const { email } = ctx.validatedData;

  const user = await userService.findOne({ email });

  if (!user) {
    ctx.body = {};
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx) {
  const { user } = ctx.validatedData;

  const resetPasswordToken = await securityUtil.generateSecureToken();

  await Promise.all([
    userService.updateOne(
      { _id: user._id },
      (old) => ({ ...old, resetPasswordToken }),
    ),
    emailService.sendForgotPassword({
      email: user.email,
      resetPasswordToken,
    }),
  ]);

  ctx.body = {};
}

module.exports.register = (router) => {
  router.post('/resend-email', validate(schema), validator, handler);
};
