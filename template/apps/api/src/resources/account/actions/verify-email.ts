import Joi from 'joi';

import config from 'config';
import { authService, emailService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';

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
  user: User;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const user = await userService.findOne({ signupToken: ctx.validatedData.token });

  ctx.assertClientError(user, { token: 'Token is invalid' }, 404);

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  await Promise.all([
    userService.updateOne({ _id: user._id }, () => ({
      isEmailVerified: true,
      signupToken: null,
    })),
    userService.updateLastRequest(user._id),
    authService.setTokens(ctx, user._id),
  ]);

  await emailService.sendSignUpWelcome(user.email, {
    userName: user.fullName,
    actionLink: `${config.webUrl}/sign-in`,
    actionText: 'Sign in',
  });

  ctx.redirect(config.webUrl);
}

export default (router: AppRouter) => {
  router.get('/verify-email', validateMiddleware(schema), validator, handler);
};
