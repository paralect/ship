import { authService, docsService } from 'services';
import { AppKoaContext, AppRouter } from 'types';

import docConfig from './doc';

const handler = async (ctx: AppKoaContext) => {
  await authService.unsetTokens(ctx);

  ctx.body = {};
};

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.post('/sign-out', handler);
};
