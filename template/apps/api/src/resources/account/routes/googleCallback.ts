import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';

import { authService, googleService } from 'services';

import config from 'config';

import type { HonoEnv } from 'types';

export default async function (c: Context<HonoEnv>) {
  try {
    const user = await googleService.validateCallback({
      code: c.req.query('code') ?? undefined,
      state: c.req.query('state') ?? undefined,
      storedState: getCookie(c, 'google-oauth-state'),
      codeVerifier: getCookie(c, 'google-code-verifier'),
    });

    if (!user) {
      throw new Error('Failed to authenticate with Google');
    }

    await authService.setAccessToken({ ctx: c.var.ctx, userId: user._id });

    return c.redirect(config.WEB_URL);
  } catch (error) {
    const url = new URL(config.WEB_URL);
    url.searchParams.set(
      'error',
      encodeURIComponent(error instanceof Error ? error.message : 'Google authentication failed'),
    );
    return c.redirect(url.toString());
  }
}
