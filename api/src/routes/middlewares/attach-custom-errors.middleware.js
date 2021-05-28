const _ = require('lodash');

const formatError = (customError) => {
  const errors = {};

  Object.keys(customError).forEach((key) => {
    errors[key] = _.isArray(customError[key])
      ? customError[key]
      : [customError[key]];
  });

  return errors;
};

const attachCustomErrors = async (ctx, next) => {
  ctx.throwError = (message) => ctx.throw(500, { message });
  ctx.assertError = (condition, message) => ctx.assert(condition, 500, { message });

  ctx.throwClientError = (errors) => ctx.throw(400, { errors: formatError(errors) });
  ctx.assertClientError = (condition, errors) => ctx.assert(condition, 400, { errors: formatError(errors) });

  await next();
};

module.exports = attachCustomErrors;
