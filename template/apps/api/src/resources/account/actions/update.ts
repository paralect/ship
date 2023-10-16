import _ from 'lodash';
import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { PASSWORD_REGEX } from 'app-constants';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100).optional(),
  lastName: z.string().min(1, 'Please enter Last name').max(100).optional(),
  password: z.string().regex(PASSWORD_REGEX, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).').optional(),
}).strict();

interface ValidatedData extends z.infer<typeof schema> {
  passwordHash?: string | null;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  if (_.isEmpty(ctx.validatedData)) {
    ctx.body = userService.getPublic(user);

    return;
  }

  if (password) {
    ctx.validatedData.passwordHash = await securityUtil.getHash(password);

    delete ctx.validatedData.password;
  }

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;

  const updatedUser = await userService.updateOne(
    { _id: user._id },
    () => _.pickBy(ctx.validatedData),
  );

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(schema), validator, handler);
};
