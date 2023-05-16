import { AppKoaContext, AppRouter } from 'types';
import { docsService } from 'services';

async function handler(ctx: AppKoaContext) {
  ctx.body = docsService.getDocs();
  ctx.status = 200;
}

export default (router: AppRouter) => {
  router.get('/json', handler);
};
