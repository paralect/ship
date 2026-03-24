import { pub } from 'procedures';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';

import config from 'config';

export default pub
  .route({
    method: 'GET',
    path: '/account/verify-reset-token',
    successStatus: 307,
    outputStructure: 'detailed',
  })
  .input(z.object({ token: z.string().optional() }))
  .handler(async ({ input }) => {
    try {
      if (!input.token) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is required'));
        return { headers: { location: url.toString() } };
      }

      const resetPasswordToken = await tokenService.validateToken(input.token, TokenType.RESET_PASSWORD);
      const user = await userService.findOne({ _id: resetPasswordToken?.userId });

      if (!resetPasswordToken || !user) {
        const url = new URL(config.WEB_URL);
        url.searchParams.set('error', encodeURIComponent('Token is invalid or expired.'));
        return { headers: { location: url.toString() } };
      }

      const redirectUrl = new URL(`${config.WEB_URL}/reset-password`);
      redirectUrl.searchParams.set('token', input.token);

      return { headers: { location: redirectUrl.toString() } };
    } catch {
      const url = new URL(config.WEB_URL);
      url.searchParams.set('error', encodeURIComponent('Failed to verify reset password token. Please try again.'));
      return { headers: { location: url.toString() } };
    }
  });
