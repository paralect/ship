const Joi = require('joi');

const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'Last name is required',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  avatarFileKey: Joi.string()
    .allow(null),
});

async function validator(ctx, next) {
  const { email } = ctx.validatedData;

  const isEmailInUse = await userService.exists({
    _id: { $ne: ctx.state.user._id },
    email,
  });

  ctx.assertError(isEmailInUse, {
    email: ['This email is already in use'],
  });

  await next();
}

async function handler(ctx) {
  let { user } = ctx.state;

  const data = ctx.validatedData;

  if (Object.keys(data).length > 0) {
    user = await userService.updateOne(
      { _id: user._id },
      (old) => ({ ...old, ...data }),
    );
  }

  ctx.body = userService.getPublic(user);
}

module.exports.register = (router) => {
  router.put('/current', validate(schema), validator, handler);
};
