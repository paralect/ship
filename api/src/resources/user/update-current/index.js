const Joi = require('joi');

const validate = require('middlewares/validate.middleware');

const securityUtil = require('security.util');

const userService = require('resources/user/user.service');

const schema = Joi.object({
  password: Joi.string()
    .trim()
    .min(6)
    .max(50)
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be 6-50 characters',
      'string.max': 'Password must be 6-50 characters',
    }),
});

async function validator(ctx, next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash);
  ctx.assertClientError(!isPasswordMatch, {
    password: 'The new password should be different from the previous one',
  });

  await next();
}

async function handler(ctx) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  const passwordHash = await securityUtil.getHash(password);

  const updatedUser = await userService.updateOne(
    { _id: user._id },
    (old) => ({
      ...old,
      passwordHash,
    }),
  );

  ctx.body = userService.getPublic(updatedUser);
}

module.exports.register = (router) => {
  router.post('/current', validate(schema), validator, handler);
};
