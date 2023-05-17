import { AppKoaContext, AppRouter } from 'types';
import { userService } from 'resources/user';
import { docsService } from 'services';

import docConfig from './doc';

async function handler(ctx: AppKoaContext) {
  ctx.body = {
    ...userService.getPublic(ctx.state.user),
    isShadow: ctx.state.isShadow,
  };
}

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.get('/', handler);
};
