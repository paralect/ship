import userService from 'resources/user/user.service';
import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  ctx.body = userService.getPublic(ctx.state.user);
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
