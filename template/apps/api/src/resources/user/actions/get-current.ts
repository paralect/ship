import { AppKoaContext, AppRouter } from 'types';

async function handler(ctx: AppKoaContext) {
  const data = { ...ctx.state.user };

  if (ctx.state.isShadow) {
    data.isShadow = true;
  }

  ctx.body = data;
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
