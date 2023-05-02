import { AppKoaContext, AppRouter } from 'types';
import { docsUtil } from 'utils';

async function handler(ctx: AppKoaContext) {
  ctx.body = docsUtil.getDocs();
  ctx.status = 200;
}

export default (router: AppRouter) => {
  router.get('/json', handler);
};
