import { AppKoaContext, AppRouter } from 'types';

import { authService } from 'services';

const handler = async (ctx: AppKoaContext) => {
  await authService.unsetTokens(ctx);

  ctx.status = 204;
};

export default (router: AppRouter) => {
  router.post('/sign-out', handler);
};
