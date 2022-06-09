import { AppKoaContext, AppRouter } from 'types';
import { userService } from 'resources/user';

async function handler(ctx: AppKoaContext) {
  ctx.body = userService.getPublic(ctx.state.user);
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
