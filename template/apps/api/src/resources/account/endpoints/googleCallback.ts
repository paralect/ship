import isPublic from 'middlewares/isPublic';
import { authService, googleService } from 'services';
import createEndpoint from 'routes/createEndpoint';

import config from 'config';

export default createEndpoint({
  method: 'get',
  path: '/sign-in/google/callback',
  middlewares: [isPublic],

  async handler(ctx) {
    try {
      const user = await googleService.validateCallback({
        code: ctx.request.query.code?.toString(),
        state: ctx.request.query.state?.toString(),
        storedState: ctx.cookies.get('google-oauth-state'),
        codeVerifier: ctx.cookies.get('google-code-verifier'),
      });

      if (!user) {
        throw new Error('Failed to authenticate with Google');
      }

      await authService.setAccessToken({ ctx, userId: user._id });

      ctx.redirect(config.WEB_URL);
    } catch (error) {
      ctx.throwGlobalErrorWithRedirect(error instanceof Error ? error.message : 'Google authentication failed');
    }
  },
});
