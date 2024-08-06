import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { authService } from 'services';
import { securityUtil } from 'utils';

import { signInSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, SignInParams, User } from 'types';

interface ValidatedData extends SignInParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email, password } = ctx.validatedData;

  const user = await userService.findOne({ email });

  ctx.assertClientError(user && user.passwordHash, {
    credentials: 'The email or password you have entered is invalid',
  });

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash);

  ctx.assertClientError(isPasswordMatch, {
    credentials: 'The email or password you have entered is invalid',
  });

  ctx.assertClientError(user.isEmailVerified, {
    email: 'Please verify your email to sign in',
  });

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  await Promise.all([userService.updateLastRequest(user._id), authService.setTokens(ctx, user._id)]);

  ctx.body = userService.getPublic(user);
}

export default (router: AppRouter) => {
  router.post('/sign-in', rateLimitMiddleware(), validateMiddleware(signInSchema), validator, handler);
};
