const Joi = require('joi');
const baseValidator = require('resources/base.validator');
const userService = require('resources/user/user.service');

const schema = {
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .options({
      language: {
        any: { empty: '!!Email is required' },
        string: { email: '!!Please enter a valid email address' },
      },
    }),
};

exports.validate = ctx =>
  baseValidator(ctx, schema, async (data) => {
    const userExists = await userService.exists({ email: data.email });

    if (!userExists) {
      ctx.errors.push({
        email: `Couldn't find account associated with ${data.email}. Please try again`,
      });
      return false;
    }

    return data;
  });
