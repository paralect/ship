import { userService } from 'resources/user';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  ctx.body = {
    ...userService.getPublic(ctx.state.user),
    isShadow: ctx.state.isShadow,
  };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
