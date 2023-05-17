import { z } from 'zod';

import config from 'config';
import { securityUtil } from 'utils';
import { analyticsService, emailService, docsService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';

import { schema } from './schema';
import docConfig from './doc';

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });

  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    firstName,
    lastName,
    email,
    password,
  } = ctx.validatedData;

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(password),
    securityUtil.generateSecureToken(),
  ]);

  const user = await userService.insertOne({
    email,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    passwordHash: hash.toString(),
    isEmailVerified: false,
    signupToken,
  });

  analyticsService.track('New user created', {
    firstName,
    lastName,
  });

  await emailService.sendVerifyEmail(user.email, {
    verifyEmailUrl: `${config.apiUrl}/account/verify-email?token=${signupToken}`,
  });

  ctx.body = config.isDev ? { signupToken } : {};
}

export default (router: AppRouter) => {
  docsService.registerDocs(docConfig);

  router.post('/sign-up', validateMiddleware(schema), validator, handler);
};
