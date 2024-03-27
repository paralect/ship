import { userService } from 'resources/user';

import config from 'config';

import logger from 'logger';

import { AppKoaContext, Next, ValidationErrors } from 'types';

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

      let loggerMetadata = {};

      if (!config.IS_DEV) {
        loggerMetadata = {
          requestBody: ctx.request.body,
          requestQuery: ctx.request.query,
          user: userService.getPublic(ctx.state.user),
        };
      }

      logger.error(JSON.stringify(errors, null, 4), loggerMetadata);

      if (serverError && config.APP_ENV === 'production') {
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
