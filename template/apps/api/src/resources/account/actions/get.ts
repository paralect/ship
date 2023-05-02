import { AppKoaContext, AppRouter } from 'types';

import { userService } from 'resources/user';
import { docsUtil } from 'utils';

async function handler(ctx: AppKoaContext) {
  ctx.body = { ...userService.getPublic(ctx.state.user), isShadow: Boolean(ctx.state.isShadow) };
}

export default (router: AppRouter) => {
  docsUtil.registerDocs({
    private: true,
    tags: ['account'],
    method: 'get',
    path: '/account/',
    summary: 'Get current user',
    request: {},
    responses: {},
  });

  router.get('/', handler);
};
