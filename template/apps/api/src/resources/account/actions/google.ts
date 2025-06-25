import { authService, googleService } from 'services';

import config from 'config';

import { AppKoaContext, AppRouter } from 'types';

const handleGetOAuthUrl = async (ctx: AppKoaContext) => {
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
};

const handleOAuthCallback = async (ctx: AppKoaContext) => {
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
};

export default (router: AppRouter) => {
  router.get('/sign-in/google', handleGetOAuthUrl);
  router.get('/sign-in/google/callback', handleOAuthCallback);
};
