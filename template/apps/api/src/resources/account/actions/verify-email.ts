import { z } from 'zod';

import { AppKoaContext, Next, AppRouter, Template, User } from 'types';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { authService, emailService } from 'services';

import config from 'config';

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const user = await userService.findOne({ signupToken: ctx.validatedData.token });

  ctx.assertClientError(user, { token: 'Token is invalid' }, 404);

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  await userService.updateOne(
    { _id: user._id },
    () => ({
      isEmailVerified: true,
      signupToken: null,
    }),
  );

  await Promise.all([
    userService.updateLastRequest(user._id),
    authService.setTokens(ctx, user._id),
  ]);

  await emailService.sendTemplate<Template.SIGN_UP_WELCOME>({
    to: user.email,
    subject: 'Welcome to Ship Community!',
    template: Template.SIGN_UP_WELCOME,
    params: {
      firstName: user.firstName,
      href: `${config.WEB_URL}/sign-in`,
    },
  });

  ctx.redirect(config.WEB_URL);
}

export default (router: AppRouter) => {
  router.get('/verify-email', validateMiddleware(schema), validator, handler);
};
