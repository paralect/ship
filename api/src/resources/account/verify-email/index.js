const Joi = require('joi');

const config = require('config');
const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');
const authService = require('services/auth.service');

const schema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
    }),
});

async function validator(ctx, next) {
  const user = await userService.findOne({ signupToken: ctx.validatedData.token });
  ctx.assertError(!user, {
    token: ['Token is invalid'],
  });

  ctx.validatedData.userId = user._id;

  await next();
}

async function handler(ctx) {
  const { userId } = ctx.validatedData;

  await Promise.all([
    userService.updateOne(
      { _id: userId },
      (old) => ({ ...old, isEmailVerified: true, signupToken: null }),
    ),
    userService.updateLastRequest(userId),
    authService.setTokens(ctx, userId),
  ]);

  ctx.redirect(config.webUrl);
}

module.exports.register = (router) => {
  router.get('/verify-email', validate(schema), validator, handler);
};
