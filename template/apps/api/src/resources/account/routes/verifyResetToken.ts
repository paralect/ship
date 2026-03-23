import type { Context } from 'hono';

import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';

import config from 'config';

import type { HonoEnv } from 'types';

export default async function (c: Context<HonoEnv>) {
  try {
    const token = c.req.query('token');

    if (!token) {
      const url = new URL(config.WEB_URL);
      url.searchParams.set('error', encodeURIComponent('Token is required'));
      return c.redirect(url.toString());
    }

    const resetPasswordToken = await tokenService.validateToken(token, TokenType.RESET_PASSWORD);
    const user = await userService.findOne({ _id: resetPasswordToken?.userId });

    if (!resetPasswordToken || !user) {
      const url = new URL(config.WEB_URL);
      url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
      return c.redirect(url.toString());
    }

    const redirectUrl = new URL(`${config.WEB_URL}/reset-password`);
    redirectUrl.searchParams.set('token', token);

    return c.redirect(redirectUrl.toString());
  } catch {
    const url = new URL(config.WEB_URL);
    url.searchParams.set('error', encodeURIComponent('Failed to verify reset password token. Please try again.'));
    return c.redirect(url.toString());
  }
}
