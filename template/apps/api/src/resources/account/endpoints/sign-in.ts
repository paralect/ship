import { tokenService } from 'resources/token';
import { userService } from 'resources/users';

import { rateLimitMiddleware } from 'middlewares';
import { authService } from 'services';
import { securityUtil } from 'utils';
import { isPublic } from 'routes/middlewares';
import { createEndpoint, createMiddleware } from 'routes/types';

import { signInSchema } from '../account.schema';
import { AppKoaContext, SignInParams, TokenType, User } from 'types';

export const schema = signInSchema;

interface ValidatedData extends SignInParams {
  user: User;
}

const validator = createMiddleware(async (ctx, next) => {
  const { email, password } = ctx.validatedData;

  const user = await userService.findOne({ email });

  ctx.assertClientError(user && user.passwordHash, {
    credentials: 'The email or password you have entered is invalid',
  });

  const isPasswordMatch = await securityUtil.verifyPasswordHash(user!.passwordHash!, password);

  ctx.assertClientError(isPasswordMatch, {
    credentials: 'The email or password you have entered is invalid',
  });

  if (!user!.isEmailVerified) {
    const existingEmailVerificationToken = await tokenService.getUserActiveToken(
      user!._id,
      TokenType.EMAIL_VERIFICATION,
    );

    ctx.assertClientError(existingEmailVerificationToken, {
      emailVerificationTokenExpired: true,
    });
  }

  ctx.assertClientError(user!.isEmailVerified, {
    email: 'Please verify your email to sign in',
  });

  ctx.validatedData.user = user!;
  await next();
});

export default createEndpoint({
  method: 'post',
  path: '/sign-in',
  schema,
  middlewares: [isPublic, rateLimitMiddleware(), validator],

  async handler(ctx) {
    const { user } = (ctx as AppKoaContext<ValidatedData>).validatedData;

    await authService.setAccessToken({ ctx, userId: user._id });

    return userService.getPublic(user);
  },
});
