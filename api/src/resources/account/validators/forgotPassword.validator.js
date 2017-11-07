const Joi = require('joi');
const baseValidator = require('resources/base.validator');

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

exports.validate = ctx => baseValidator(ctx, schema, data => data);
