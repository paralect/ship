import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { authService } from 'services';
import { securityUtil } from 'utils';
import { isPublic } from 'routes/middlewares';
import { createEndpoint } from 'routes/types';

import { signInSchema } from '../account.schema';
import { TokenType } from 'types';

export const schema = signInSchema;

export default createEndpoint({
  method: 'post',
  path: '/sign-in',
  schema,
  middlewares: [isPublic, rateLimitMiddleware()],

  async handler(ctx) {
    const { email, password } = ctx.validatedData;

    const user = await userService.findOne({ email });

    if (!user || !user.passwordHash) {
      ctx.throwClientError({
        credentials: 'The email or password you have entered is invalid',
      });
    }

    const isPasswordMatch = await securityUtil.verifyPasswordHash(user.passwordHash, password);

    if (!isPasswordMatch) {
      ctx.throwClientError({
        credentials: 'The email or password you have entered is invalid',
      });
    }

    if (!user.isEmailVerified) {
      const existingEmailVerificationToken = await tokenService.getUserActiveToken(
        user._id,
        TokenType.EMAIL_VERIFICATION,
      );

      if (!existingEmailVerificationToken) {
        ctx.throwClientError({
          emailVerificationTokenExpired: true,
        });
      }
    }

    if (!user.isEmailVerified) {
      ctx.throwClientError({
        email: 'Please verify your email to sign in',
      });
    }

    await authService.setAccessToken({ ctx, userId: user._id });

    return userService.getPublic(user);
  },
});
