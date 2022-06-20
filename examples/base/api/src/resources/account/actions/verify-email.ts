import Joi from 'joi';

import config from 'config';
import { authService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService } from 'resources/user';

const schema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
    }),
});

type ValidatedData = {
  token: string;
  userId: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const user = await userService.findOne({ signupToken: ctx.validatedData.token });

  ctx.assertClientError(user, { token: 'Token is invalid' }, 404);

  ctx.validatedData.userId = user._id;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { userId } = ctx.validatedData;

  await Promise.all([
    userService.updateOne({ _id: userId }, () => ({
      isEmailVerified: true,
      signupToken: null,
    })),
    userService.updateLastRequest(userId),
    authService.setTokens(ctx, userId),
  ]);

  ctx.redirect(config.webUrl);
}

export default (router: AppRouter) => {
  router.get('/verify-email', validateMiddleware(schema), validator, handler);
};
