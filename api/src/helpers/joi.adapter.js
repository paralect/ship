const Joi = require('joi');
const _ = require('lodash');

const joiOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: {
    objects: true,
  },
};

/**
 * Parse and return list of errors
 * @param {object} joiError
 * @return {object[]}
 */
const parseJoiErrors = (joiError) => {
  let resultErrors = [];
  if (joiError && _.isArray(joiError.details)) {
    resultErrors = joiError.details.map((error) => {
      const pathLastPart = error.path.slice(error.path.length - error.context.key.length);

      if (pathLastPart === error.context.key) {
        return { [error.path]: error.message };
      }

      return { [error.context.key]: error.message };
    });
  }

  return resultErrors;
};

const validate = _.curry((schema, payload) => {
  const { error, value } = Joi.validate(payload, schema, joiOptions);

  return {
    errors: parseJoiErrors(error),
    value,
  };
});

module.exports = {
  ...Joi,
  __validate: Joi.validate,
  validate,
};
