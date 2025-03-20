import { userService } from 'resources/user';

import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  ctx.body = userService.getPublic(user);
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
