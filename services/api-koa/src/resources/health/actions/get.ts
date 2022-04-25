import { AppKoaContext, AppRouter } from 'types';

const handler = (ctx: AppKoaContext) => {
  ctx.status = 200;
};

export default (router: AppRouter) => {
  router.get('/', handler);
};
