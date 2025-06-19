import { authUtil } from 'utils';

import { AppKoaContext, AppRouter } from 'types';

const handler = async (ctx: AppKoaContext) => {
  await authUtil.removeAuthToken({ ctx });

  ctx.status = 204;
};

export default (router: AppRouter) => {
  router.post('/sign-out', handler);
};
