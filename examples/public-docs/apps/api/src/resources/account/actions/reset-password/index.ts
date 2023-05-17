import { z } from 'zod';

import { securityUtil } from 'utils';
import { docsService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';

import docConfig from './doc';
import { schema } from './schema';

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { token } = ctx.validatedData;

  const user = await userService.findOne({ resetPasswordToken: token });

  if (!user) return ctx.body = {};

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user, password } = ctx.validatedData;

  const passwordHash = await securityUtil.getHash(password);

  await userService.updateOne({ _id: user._id }, () => ({
    passwordHash,
    resetPasswordToken: null,
  }));

  ctx.body = {};
}

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.put('/reset-password', validateMiddleware(schema), validator, handler);
};
