import { z } from 'zod';

import { User, userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';
import { authService } from 'services';

import { emailRegex, passwordRegex } from 'resources/account/account.constants';

import { AppKoaContext, AppRouter, Next } from 'types';

const schema = z.object({
  email: z.string().regex(emailRegex, 'Email format is incorrect.'),
  password: z.string().regex(passwordRegex, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

interface ValidatedData extends z.infer<typeof schema> {
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

  await Promise.all([
    userService.updateLastRequest(user._id),
    authService.setTokens(ctx, user._id),
  ]);

  ctx.body = userService.getPublic(user);
}

export default (router: AppRouter) => {
  router.post('/sign-in', rateLimitMiddleware, validateMiddleware(schema), validator, handler);
};
