import { AppKoaContext, Next } from 'types';

const attachCustomProperties = async (ctx: AppKoaContext, next: Next) => {
  ctx.validatedData = {};

  await next();
};

export default attachCustomProperties;
