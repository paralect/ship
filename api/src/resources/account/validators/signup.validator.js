const Joi = require('joi');

const userService = require('resources/user/user.service');
const baseValidator = require('resources/base.validator');

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
  password: Joi.string()
    .trim()
    .min(6)
    .max(40)
    .options({
      language: {
        string: {
          min: '!!Password is too short',
          max: '!!Password is too long',
        },
        any: { empty: '!!Password is required' },
      },
    }),
};

exports.validate = ctx =>
  baseValidator(ctx, schema, async (data) => {
    const userExists = await userService.exists({ email: data.email });
    if (userExists) {
      ctx.errors.push({ email: 'User with this email is already registered.' });
      return false;
    }

    return data;
  });
