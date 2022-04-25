import _ from 'lodash';
import { ValidationErrors, AppKoaContext, Next } from 'types';

type ConditionFunc = () => boolean;
type CustomErrors = {
  [name: string]: string;
};

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
  ctx.throwError = (message: string) => ctx.throw(500, { message });
  ctx.assertError = (condition: ConditionFunc, message: string) => ctx.assert(condition, 500, { message });

  ctx.throwClientError = (errors: CustomErrors) => ctx.throw(400, { errors: formatError(errors) });
  ctx.assertClientError = (condition: ConditionFunc, errors: CustomErrors) =>
    ctx.assert(condition, 400, { errors: formatError(errors) });

  await next();
};

export default attachCustomErrors;
