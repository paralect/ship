import { AppKoaContext, Next, ValidationErrors } from 'types';

import logger from 'logger';

interface CustomError extends Error {
  status?: number;
  clientErrors?: ValidationErrors;
}

const routeErrorHandler = async (ctx: AppKoaContext, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const typedError = error as CustomError;

      const clientError = typedError.clientErrors;
      const serverError = { global: typedError.message || 'Unknown error' };

      const errors = clientError || serverError;
      logger.error(errors);

      if (serverError && process.env.APP_ENV === 'production') {
        serverError.global = 'Something went wrong';
      }

      ctx.status = typedError.status || 500;
      ctx.body = { errors };
    } else {
      logger.error(`An unexpected error type was caught. Error: ${JSON.stringify(error)}`);

      ctx.status = 500;
      ctx.body = { errors: { global: 'An unexpected error occurred' } };
    }
  }
};

export default routeErrorHandler;
