import { z } from 'zod';

import config from 'config';
import { securityUtil } from 'utils';
import { emailService, docsService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';

import docConfig from './doc';
import { schema } from './schema';

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

  await Promise.all([
    userService.updateOne({ _id: user._id }, () => ({ resetPasswordToken })),
    emailService.sendForgotPassword(user.email, {
      resetPasswordLink: `${config.webUrl}/reset-password?token=${resetPasswordToken}`,
    }),
  ]);

  ctx.body = {};
}

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.post('/resend-email', validateMiddleware(schema), validator, handler);
};
