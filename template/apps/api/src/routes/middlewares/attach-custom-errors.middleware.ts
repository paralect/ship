import _ from 'lodash';

import { AppKoaContext, CustomErrors, Next, ValidationErrors } from 'types';

const formatError = (customError: CustomErrors): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(customError).forEach((key) => {
    errors[key] = _.isArray(customError[key]) ? customError[key] : [customError[key]];
  });

  return errors;
};

const attachCustomErrors = async (ctx: AppKoaContext<{ db: number }>, next: Next) => {
  const db = 1;

  ctx.validatedData.db = db;
  ctx.throwError = (message, status = 400) => ctx.throw(status, { message });
  ctx.assertError = (condition, message, status = 400) => ctx.assert(condition, status, { message });

  ctx.throwClientError = (errors, status = 400) => ctx.throw(status, { clientErrors: formatError(errors) });
  ctx.assertClientError = (condition, errors, status = 400) =>
    ctx.assert(condition, status, { clientErrors: formatError(errors) });

  await next();
};

export default attachCustomErrors;
