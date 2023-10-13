import { z } from 'zod';

import { AppKoaContext, Next, AppRouter, Template, User } from 'types';
import { EMAIL_REGEX } from 'app-constants';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { emailService } from 'services';
import { securityUtil } from 'utils';

import config from 'config';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
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
