import _ from 'lodash';

import { ValidationErrors, AppKoaContext, Next, CustomErrors } from 'types';

const formatError = (customError: CustomErrors): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(customError).forEach((key) => {
    errors[key] = _.isArray(customError[key])
      ? customError[key]
      : [customError[key]];
  });

  return errors;
};

const attachCustomErrors = async (ctx: AppKoaContext, next: Next) => {
  ctx.throwError = (message) => ctx.throw(500, { message });
  ctx.assertError = (condition, message) => ctx.assert(condition, 500, { message });

  ctx.throwClientError = (errors, status = 400) => ctx.throw(status, { clientErrors: formatError(errors) });
  ctx.assertClientError = (condition, errors, status = 400) =>
    ctx.assert(condition, status, { clientErrors: formatError(errors) });

  await next();
};

export default attachCustomErrors;
