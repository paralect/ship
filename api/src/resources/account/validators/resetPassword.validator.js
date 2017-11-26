const Joi = require('joi');

const baseValidator = require('resources/base.validator');
const userService = require('resources/user/user.service');

const schema = {
  token: Joi.string(),
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

exports.validate = ctx =>
  baseValidator(ctx, schema, async (data) => {
    const user = await userService.findOne({ resetPasswordToken: data.token });
    if (!user) {
      ctx.errors.push({ token: 'Password reset link has expired or invalid' });
      return false;
    }

    return {
      userId: user._id,
      password: data.password,
    };
  });
