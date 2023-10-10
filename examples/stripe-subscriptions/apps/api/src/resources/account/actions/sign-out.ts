import { authService } from 'services';
import { AppKoaContext, AppRouter } from 'types';

const handler = async (ctx: AppKoaContext) => {
  await authService.unsetTokens(ctx);

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.post('/sign-out', handler);
};
