const Joi = require('joi');

const securityUtil = require('security.util');
const validate = require('middlewares/validate');
const authService = require('services/auth.service');
const userService = require('resources/user/user.service');

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
  password: Joi.string()
    .trim()
    .min(6)
    .max(50)
    .required()
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be 6-50 characters',
      'string.max': 'Password must be 6-50 characters',
    }),
});

async function validator(ctx, next) {
  const { email, password } = ctx.validatedData;

  const user = await userService.findOne({ email });
  if (!user) {
    ctx.body = {
      errors: {
        credentials: ['Incorrect email or password'],
      },
    };
    ctx.throw(400);
  }

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash);

  if (!isPasswordMatch) {
    ctx.body = {
      errors: {
        credentials: ['Incorrect email or password'],
      },
    };
    ctx.throw(400);
  }

  if (!user.isEmailVerified) {
    ctx.body = {
      errors: {
        email: ['Please verify your email to sign in'],
      },
    };
    ctx.throw(400);
  }

  ctx.validatedData.user = user;

  await next();
}

async function handler(ctx) {
  const { user } = ctx.validatedData;

  await Promise.all([
    userService.updateLastRequest(user._id),
    authService.setTokens(ctx, user._id),
  ]);

  ctx.body = userService.getPublic(user);
}

module.exports.register = (router) => {
  router.post('/signin', validate(schema), validator, handler);
};
