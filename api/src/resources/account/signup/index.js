const Joi = require('joi');

const validate = require('middlewares/validate');
const securityUtil = require('security.util');
const userService = require('resources/user/user.service');
const emailService = require('services/email.service');

const config = require('config');

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'First name is required',
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name is required',
    }),
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
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });
  ctx.assertError(isUserExists, {
    email: ['User with this email is already registered'],
  });

  await next();
}

async function handler(ctx) {
  const data = ctx.validatedData;

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(data.password),
    securityUtil.generateSecureToken(),
  ]);

  const user = await userService.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash: hash.toString(),
    isEmailVerified: false,
    signupToken,
    oauth: {
      google: false,
    },
  });

  await emailService.sendSignupWelcome({
    email: user.email,
    signupToken,
  });

  ctx.body = {
    signupToken: config.isDev ? signupToken : undefined,
  };
}

module.exports.register = (router) => {
  router.post('/signup', validate(schema), validator, handler);
};
