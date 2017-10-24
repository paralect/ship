const Joi = require('joi');

const userService = require('resources/user/user.service');
const baseValidator = require('resources/base.validator');

const schema = {
  firstName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your first name must be longer then 1 letter' },
      },
    }),
  lastName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your last name must be longer then 1 letter' },
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

exports.validate = ctx => baseValidator(ctx, schema, async (data) => {
  const userExists = await userService.exists({ email: ctx.request.body.email });
  if (userExists) {
    ctx.errors.push({ email: 'User with this email is already registered.' });
    return false;
  }

  return data;
});
