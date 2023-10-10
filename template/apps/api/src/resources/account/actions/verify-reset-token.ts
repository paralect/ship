import { z } from 'zod';

import config from 'config';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { User, userService } from 'resources/user';
import { emailRegex } from 'resources/account/account.constants';

const schema = z.object({
  email: z.string().regex(emailRegex, 'Email format is incorrect.'),
  token: z.string().min(1, 'Token is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>) {
  const { email, token } = ctx.validatedData;

  const user = await userService.findOne({ resetPasswordToken: token });

  const redirectUrl = user
    ? `${config.WEB_URL}/reset-password?token=${token}`
    : `${config.WEB_URL}/expire-token?email=${email}`;

  ctx.redirect(redirectUrl);
}

export default (router: AppRouter) => {
  router.get('/verify-reset-token', validateMiddleware(schema), validator);
};
