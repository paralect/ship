import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { securityUtil } from 'utils';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';

const schema = z.object({
  password: z.string().regex(
    /^$|^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash || '');
  ctx.assertClientError(!isPasswordMatch, {
    password: 'The new password should be different from the previous one',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  const passwordHash = await securityUtil.getHash(password);

  const updatedUser = await userService.updateOne({ _id: user._id }, () => ({ passwordHash }));

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(schema), validator, handler);
};
