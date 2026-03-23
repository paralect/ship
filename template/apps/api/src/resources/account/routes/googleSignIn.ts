import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';

import { googleService } from 'services';

import config from 'config';

import type { HonoEnv } from 'types';

export default async function (c: Context<HonoEnv>) {
  try {
    const { state, codeVerifier, authorizationUrl } = googleService.createAuthUrl();

    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: c.req.url.startsWith('https'),
      maxAge: 60 * 10,
      sameSite: 'Lax' as const,
    };

    setCookie(c, 'google-oauth-state', state, cookieOptions);
    setCookie(c, 'google-code-verifier', codeVerifier, cookieOptions);

    return c.redirect(authorizationUrl);
  } catch (error) {
    const url = new URL(config.WEB_URL);
    url.searchParams.set(
      'error',
      encodeURIComponent(error instanceof Error ? error.message : 'Failed to create Google OAuth URL'),
    );
    return c.redirect(url.toString());
  }
}
