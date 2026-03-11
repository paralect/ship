import { emailSchema, TokenType } from 'shared';
import { z } from 'zod';

import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import isPublic from 'middlewares/isPublic';
import rateLimitMiddleware from 'middlewares/rateLimit';
import { authService } from 'services';
import { clientUtil, securityUtil } from 'utils';
import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Password must be less than 128 characters.'),
});

export default createEndpoint({
  method: 'post',
  path: '/sign-in',
  schema,
  middlewares: [isPublic, rateLimitMiddleware()],

  async handler(ctx) {
    const { email, password } = ctx.validatedData;

    const user = await userService.findOne({ email });

    if (!user || !user.passwordHash) {
      return ctx.throwClientError({
        credentials: 'The email or password you have entered is invalid',
      });
    }

    const isPasswordMatch = await securityUtil.verifyPasswordHash(user.passwordHash, password);

    if (!isPasswordMatch) {
      return ctx.throwClientError({
        credentials: 'The email or password you have entered is invalid',
      });
    }

    if (!user.isEmailVerified) {
      const existingEmailVerificationToken = await tokenService.getUserActiveToken(
        user._id,
        TokenType.EMAIL_VERIFICATION,
      );

      if (!existingEmailVerificationToken) {
        return ctx.throwClientError({
          emailVerificationTokenExpired: true,
        });
      }
    }

    if (!user.isEmailVerified) {
      return ctx.throwClientError({
        email: 'Please verify your email to sign in',
      });
    }

    const accessToken = await authService.setAccessToken({ ctx, userId: user._id });
    const clientType = clientUtil.detectClientType(ctx);

    if (clientType === clientUtil.ClientType.MOBILE) {
      return {
        accessToken,
        user: userService.getPublic(user),
      };
    }

    return userService.getPublic(user);
  },
});
