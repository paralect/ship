import { z } from 'zod';

import config from 'config';
import { securityUtil } from 'utils';
import { emailService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter, Template } from 'types';
import { userService, User } from 'resources/user';
import { emailRegex } from 'resources/account/account.constants';

const schema = z.object({
  email: z.string().regex(emailRegex, 'Email format is incorrect.'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const user = await userService.findOne({ email });

  if (!user) return ctx.body = {};

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  const resetPasswordToken = await securityUtil.generateSecureToken();

  const resetPasswordUrl = `${config.API_URL}/account/verify-reset-token?token=${resetPasswordToken}&email=${encodeURIComponent(user.email)}`;

  await Promise.all([
    userService.updateOne({ _id: user._id }, () => ({ resetPasswordToken })),
    emailService.sendTemplate<Template.RESET_PASSWORD>({
      to: user.email,
      subject: 'Password Reset Request for Ship',
      template: Template.RESET_PASSWORD,
      params: {
        firstName: user.firstName,
        href: resetPasswordUrl,
      },
    }),
  ]);

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/resend-email', validateMiddleware(schema), validator, handler);
};
