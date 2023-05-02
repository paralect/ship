import { z } from 'zod';

import { securityUtil, docsUtil } from 'utils';
import { authService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';

const schema = z.object({
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().min(1, 'Please enter password'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email, password } = ctx.validatedData;

  const user = await userService.findOne({ email });

  ctx.assertClientError(user && user.passwordHash, {
    credentials: 'The email or password you have entered is invalid',
  });

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, user.passwordHash);
  ctx.assertClientError(isPasswordMatch, {
    credentials: 'The email or password you have entered is invalid',
  });

  ctx.assertClientError(user.isEmailVerified, {
    email: 'Please verify your email to sign in',
  });

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  await Promise.all([
    userService.updateLastRequest(user._id),
    authService.setTokens(ctx, user._id),
  ]);

  ctx.body = userService.getPublic(user);
}

export default (router: AppRouter) => {
  docsUtil.registerDocs({
    private: false,
    tags: ['account'],
    method: 'post',
    path: '/account/sign-in',
    summary: 'Sign in',
    request: {
      body: { content: { 'application/json': { schema } } },
    },
    responses: {
      // 200: {
      //   description: 'Object with user data.',
      //   content: {
      //     'application/json': {
      //       schema: UserSchema,
      //     },
      //   },
      // },
      // 204: {
      //   description: 'No content - successful operation',
      // },
    },
  });

  router.post('/sign-in', validateMiddleware(schema), validator, handler);
};
