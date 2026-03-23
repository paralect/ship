import type { Context } from 'hono';

import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';

import { authService, emailService } from 'services';

import config from 'config';

import type { HonoEnv } from 'types';
import { Template } from 'types';

export default async function (c: Context<HonoEnv>) {
  try {
    const token = c.req.query('token');

    if (!token) {
      const url = new URL(config.WEB_URL);
      url.searchParams.set('error', encodeURIComponent('Token is required'));
      return c.redirect(url.toString());
    }

    const emailVerificationToken = await tokenService.validateToken(token, TokenType.EMAIL_VERIFICATION);
    const user = await userService.findOne({ _id: emailVerificationToken?.userId });

    if (!emailVerificationToken || !user) {
      const url = new URL(config.WEB_URL);
      url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
      return c.redirect(url.toString());
    }

    await tokenService.invalidateUserTokens(user._id, TokenType.EMAIL_VERIFICATION);
    await userService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

    await authService.setAccessToken({ ctx: c.var.ctx, userId: user._id });

    await emailService.sendTemplate<typeof Template.SIGN_UP_WELCOME>({
      to: user.email,
      subject: 'Welcome to Ship Community!',
      template: Template.SIGN_UP_WELCOME,
      params: {
        firstName: user.firstName,
        href: `${config.WEB_URL}/sign-in`,
      },
    });

    return c.redirect(config.WEB_URL);
  } catch {
    const url = new URL(config.WEB_URL);
    url.searchParams.set('error', encodeURIComponent('Failed to verify email. Please try again.'));
    return c.redirect(url.toString());
  }
}
