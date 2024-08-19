import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { emailService } from 'services';
import { securityUtil } from 'utils';

import config from 'config';

import { resendEmailSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next, ResendEmailParams, Template, User } from 'types';

interface ValidatedData extends ResendEmailParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const user = await userService.findOne({ email });

  if (!user) {
    ctx.status = 204;
    return;
  }

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

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.post('/resend-email', validateMiddleware(resendEmailSchema), validator, handler);
};
