const Joi = require('joi');

const baseValidator = require('resources/base.validator');

const userService = require('resources/user/user.service');
const securityUtil = require('security.util');

const schema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .options({
      language: {
        string: { email: '!!Please enter a valid email address' },
        any: { empty: '!!Email is required' },
      },
    }),
  password: Joi.string()
    .trim()
    .min(6)
    .max(20)
    .options({
      language: {
        string: {
          min: '!!Password must be 6-20 characters',
          max: '!!Password must be 6-20 characters',
        },
        any: { empty: '!!Password is required' },
      },
    }),
};

exports.validate = ctx => baseValidator(ctx, schema, async (signinData) => {
  const user = await userService.findOne({ email: signinData.email });

  if (!user) {
    ctx.errors.push({ email: "User with such email doesn't exist" });
    return false;
  }

  const isPasswordMatch = await securityUtil.compareTextWithHash(
    signinData.password,
    user.passwordHash,
    user.passwordSalt,
  );

  if (!isPasswordMatch) {
    ctx.errors.push({ password: 'Invalid password' });
    return false;
  }

  return {
    userId: user._id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
  };
});
