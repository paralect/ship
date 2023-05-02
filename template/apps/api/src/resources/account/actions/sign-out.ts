import { authService } from 'services';
import { AppKoaContext, AppRouter } from 'types';
import { docsUtil } from 'utils';

const handler = async (ctx: AppKoaContext) => {
  await authService.unsetTokens(ctx);

  ctx.body = {};
};

export default (router: AppRouter) => {
  docsUtil.registerDocs({
    private: false,
    tags: ['account'],
    method: 'post',
    path: '/account/sign-out',
    summary: 'Sign out',
    request: {},
    responses: {
      200: {
        description: 'Removed all auth metadata.',
      },
    },
  });

  router.post('/sign-out', handler);
};
