import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { securityUtil } from 'utils';
import { docsService } from 'services';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';

import docConfig from './doc';
import { schema } from './schema';

interface ValidatedData extends z.infer<typeof schema> {
  passwordHash?: string | null;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  if (password) {
    const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash || '');

    ctx.assertClientError(!isPasswordMatch, {
      password: 'The new password should be different from the previous one',
    });

    ctx.validatedData.passwordHash = await securityUtil.getHash(password);
  } else {
    ctx.validatedData.passwordHash = user.passwordHash;
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { firstName, lastName, passwordHash } = ctx.validatedData;

  const updatedUser = await userService.updateOne(
    {
      _id: user._id,
    },
    () => ({
      firstName,
      lastName,
      passwordHash,
    }),
  );

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.put('/', validateMiddleware(schema), validator, handler);
};
