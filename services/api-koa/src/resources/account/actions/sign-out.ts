import authService from 'services/auth/auth.service';
import { AppKoaContext, AppRouter } from 'types';

const handler = async (ctx: AppKoaContext) => {
  await authService.unsetTokens(ctx);
  ctx.body = {};
};

export default (router: AppRouter) => {
  router.post('/sign-out', handler);
};
