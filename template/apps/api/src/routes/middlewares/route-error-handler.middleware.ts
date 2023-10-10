import logger from 'logger';
import { AppKoaContext, Next } from 'types';

const routeErrorHandler = async (ctx: AppKoaContext, next: Next) => {
  try {
    await next();
  } catch (error: any) {
    const clientError = error.clientErrors;
    const serverError = { global: error.message };

    const errors = clientError || serverError;
    logger.error(errors);

    if (serverError && process.env.APP_ENV === 'production') {
      serverError.global = 'Something went wrong';
    }

    ctx.status = error.status || 500;
    ctx.body = { errors };
  }
};

export default routeErrorHandler;
