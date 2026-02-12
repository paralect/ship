import isPublic from 'middlewares/isPublic';
import { googleService } from 'services';
import createEndpoint from 'routes/createEndpoint';

export default createEndpoint({
  method: 'get',
  path: '/sign-in/google',
  middlewares: [isPublic],

  async handler(ctx) {
    try {
      const { state, codeVerifier, authorizationUrl } = googleService.createAuthUrl();

      const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: ctx.secure,
        maxAge: 60 * 10 * 1000, // valid for 10 minutes
        sameSite: 'lax' as const,
      };

      ctx.cookies.set('google-oauth-state', state, cookieOptions);
      ctx.cookies.set('google-code-verifier', codeVerifier, cookieOptions);

      ctx.redirect(authorizationUrl);
    } catch (error) {
      ctx.throwGlobalErrorWithRedirect(error instanceof Error ? error.message : 'Failed to create Google OAuth URL');
    }
  },
});
