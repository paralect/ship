import { z } from 'zod';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

import config from 'config';

import { EMAIL_REGEX } from 'app-constants';
import { AppKoaContext, AppRouter, User } from 'types';

const schema = z.object({
  email: z.string().toLowerCase().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  token: z.string().min(1, 'Token is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>) {
  const { email, token } = ctx.validatedData;

  const user = await userService.findFirst({
    where: { resetPasswordToken: token },
  });

  const redirectUrl = user
    ? `${config.WEB_URL}/reset-password?token=${token}`
    : `${config.WEB_URL}/expire-token?email=${email}`;

  ctx.redirect(redirectUrl);
}

export default (router: AppRouter) => {
  router.get('/verify-reset-token', validateMiddleware(schema), validator);
};
