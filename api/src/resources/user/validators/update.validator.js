const Joi = require('joi');

const baseValidator = require('resources/base.validator');
const userService = require('resources/user/user.service');

const schema = {
  firstName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your first name must be longer than 1 letter' },
      },
    }),
  lastName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your last name must be longer than 1 letter' },
      },
    }),
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
};

exports.validate = ctx =>
  baseValidator(ctx, schema, async (data) => {
    const userExist = await userService.exists({
      _id: { $ne: ctx.state.user._id },
      email: data.email,
    });
    if (userExist) {
      ctx.errors.push({ email: 'This email is already in use.' });
      return false;
    }

    return data;
  });
