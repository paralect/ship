import { z } from 'zod';

import { userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { authService, googleService } from 'services';

import { AppKoaContext, AppRouter, Next, User } from 'types';

const schema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { idToken } = ctx.validatedData;

  const user = await googleService.validateIdToken(idToken);

  ctx.assertClientError(user, {
    credentials: 'Failed to authenticate with Google',
  });

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  const accessToken = await authService.setAccessToken({ ctx, userId: user._id });

  ctx.body = {
    accessToken,
    user: userService.getPublic(user),
  };
}

export default (router: AppRouter) => {
  router.post('/sign-in/google-mobile', rateLimitMiddleware(), validateMiddleware(schema), validator, handler);
};
