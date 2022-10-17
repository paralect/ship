import { z } from 'zod';

import { securityUtil } from 'utils';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

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
  router.put('/reset-password', validateMiddleware(schema), validator, handler);
};
