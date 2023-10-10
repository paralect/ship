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
  const user = await userService.findOne({ email: ctx.validatedData.email });

  if (!user) return ctx.body = {};

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  let { resetPasswordToken } = user;

  if (!resetPasswordToken) {
    resetPasswordToken = await securityUtil.generateSecureToken();

    await userService.updateOne({ _id: user._id }, () => ({
      resetPasswordToken,
    }));
  }

  const resetPasswordUrl = `${config.API_URL}/account/verify-reset-token?token=${resetPasswordToken}&email=${encodeURIComponent(user.email)}`;

  await emailService.sendTemplate<Template.RESET_PASSWORD>({
    to: user.email,
    subject: 'Password Reset Request for Ship',
    template: Template.RESET_PASSWORD,
    params: {
      firstName: user.firstName,
      href: resetPasswordUrl,
    },
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/forgot-password', validateMiddleware(schema), validator, handler);
};
