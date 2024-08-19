import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { emailService } from 'services';
import { securityUtil } from 'utils';

import config from 'config';

import { forgotPasswordSchema } from 'schemas';
import { AppKoaContext, AppRouter, ForgotPasswordParams, Next, Template, User } from 'types';

interface ValidatedData extends ForgotPasswordParams {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const user = await userService.findOne({ email: ctx.validatedData.email });

  if (!user) {
    ctx.status = 204;
    return;
  }

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

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.post('/forgot-password', validateMiddleware(forgotPasswordSchema), validator, handler);
};
