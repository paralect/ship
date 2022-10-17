import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  ctx.body = { ...ctx.state.user, isShadow: Boolean(ctx.state.isShadow) };
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
