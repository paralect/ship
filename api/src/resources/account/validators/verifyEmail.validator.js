const Joi = require('joi');

const userService = require('resources/user/user.service');
const baseValidator = require('resources/base.validator');

const schema = {
  token: Joi.string().options({
    language: {
      any: { empty: '!!Token is required' },
    },
  }),
};

exports.validate = ctx =>
  baseValidator(ctx, schema, async (data) => {
    const user = await userService.findOne({ signupToken: ctx.params.token });

    if (!user) {
      ctx.errors.push({ token: 'Token is invalid' });
      return false;
    }

    return {
      userId: user._id,
    };
  });
