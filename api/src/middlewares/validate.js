const { validate, Symbols } = require('helpers/validator');

const defaultOptions = {
  throwOnInvalid: true,
};

const validateMiddleware = (validators = [], options = defaultOptions) => async (ctx, next) => {
  const {
    throwOnInvalid,
  } = {
    ...defaultOptions,
    ...options,
  };

  const payload = {
    ...ctx.request.body,
    ...ctx.query,
    ...ctx.params,
    [Symbols.PERSISTENT]: ctx,
  };

  const result = await validate(payload, validators);

  if (throwOnInvalid && result.errors.length) {
    ctx.body = {
      errors: result.errors,
    };

    ctx.throw(400);
  }

  ctx.validatedRequest = result;
  await next();
};

module.exports = validateMiddleware;
