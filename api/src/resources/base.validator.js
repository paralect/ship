const Joi = require('joi');

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
  if (joiError && joiError.details instanceof Array) {
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

/**
 *  Validate request and send 400(bad request), when request is not valid
 * @param {object} ctx
 * @param {object|Function} schema - Joi validation schema or validation function
 * @param {Function} validateFn
 * @return {object}
 */
module.exports = async (ctx, schema, validateFn) => {
  let validateFunc = validateFn;
  let joiSchema = schema;

  if (typeof schema === 'function') {
    validateFunc = schema;
    joiSchema = null;
  }

  let joiResult;
  if (joiSchema) {
    let body;
    if (ctx.method === 'GET') {
      body = ctx.params;
    } else {
      body = ctx.request.body;
    }

    joiResult = Joi.validate(body, joiSchema, joiOptions);
    if (joiResult.error) {
      ctx.errors = parseJoiErrors(joiResult.error);

      ctx.status = 400;
      ctx.body = { errors: ctx.errors };
      return { errors: ctx.errors };
    }
  }

  ctx.errors = [];
  const data = await validateFunc(joiResult.value);
  const result = {
    errors: null,
    value: data,
  };

  if (ctx.errors.length) {
    result.errors = ctx.errors;
  }

  if (result.errors) {
    ctx.status = 400;
    ctx.body = { errors: ctx.errors };
  }

  return result;
};
