import { z } from 'zod';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService } from 'resources/user';

const schema = z.object({
  role: z.string().optional(),
  goal: z.string().optional(),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;

  if (user?.isOnboardingFinished) return ctx.body = {};

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { role, goal } = ctx.validatedData;

  await userService.updateOne({
    _id: user._id,
  }, (old) => {
    old.isOnboardingFinished = true;
    old.role = role;
    old.goal = goal;

    return old;
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/finish-onboarding', validateMiddleware(schema), validator, handler);
};
