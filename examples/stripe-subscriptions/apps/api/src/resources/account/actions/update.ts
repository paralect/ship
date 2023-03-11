import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { securityUtil } from 'utils';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';

const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  password: z.string().regex(
    /^$|^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

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

  const updatedUser = await userService.updateOne({
    _id: user._id,
  }, () => ({
    firstName,
    lastName,
    passwordHash,
  }));

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(schema), validator, handler);
};
