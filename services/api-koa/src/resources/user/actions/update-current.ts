import Joi from 'joi';

import { AppKoaContext, Next, AppRouter } from 'types';
import { securityUtil } from 'utils';
import { validateMiddleware } from 'middlewares';
import { userService, User } from 'resources/user';

const schema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(50)
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be 6-50 characters',
      'string.max': 'Password must be 6-50 characters',
    })
    .required(),
});

type ValidatedData = {
  password: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { password } = ctx.validatedData;

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash);
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
  router.post('/current', validateMiddleware(schema), validator, handler);
};
