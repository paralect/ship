import config from '@/config';
import { pub } from '@/procedures';
import { googleService } from '@/services';

export default pub
  .route({
    method: 'GET',
    path: '/account/sign-in/google',
    successStatus: 307,
    outputStructure: 'detailed',
  })
  .handler(async ({ context }) => {
    try {
      const { state, codeVerifier, authorizationUrl } = googleService.createAuthUrl();

      const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: context.secure,
        maxAge: 60 * 10,
        sameSite: 'lax' as const,
      };

      context.setCookie('google-oauth-state', state, cookieOptions);
      context.setCookie('google-code-verifier', codeVerifier, cookieOptions);

      return { headers: { location: authorizationUrl } };
    } catch (error) {
      const url = new URL(config.WEB_URL);
      url.searchParams.set(
        'error',
        encodeURIComponent(error instanceof Error ? error.message : 'Failed to create Google OAuth URL'),
      );
      return { headers: { location: url.toString() } };
    }
  });
