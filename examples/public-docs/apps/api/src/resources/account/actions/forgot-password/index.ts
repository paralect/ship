import { z } from 'zod';

import config from 'config';
import { securityUtil } from 'utils';
import { emailService, docsService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';

import { schema } from './schema';
import docConfig from './doc';

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

  const resetPasswordUrl =
    `${config.apiUrl}/account/verify-reset-token?token=${resetPasswordToken}&email=${encodeURIComponent(user.email)}`;
  await emailService.sendForgotPassword(
    user.email,
    {
      firstName: user.firstName,
      resetPasswordUrl,
    },
  );

  ctx.body = {};
}

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.post('/forgot-password', validateMiddleware(schema), validator, handler);
};
