import { z } from 'zod';
import sendgrid from '@sendgrid/mail';
import { renderEmailHtml, Template } from 'mailer';

import { User, userService } from 'resources/user';

import { rateLimitMiddleware, validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';
import { authService } from 'services';

import { AppKoaContext, AppRouter, Next } from 'types';

import config from 'config';


sendgrid.setApiKey(config.SENDGRID_API_KEY ?? '');

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

  const emailHtml = await renderEmailHtml({
    template: Template.SIGN_UP_WELCOME,
    params: {
      loginCode: '111-111-111',
    },
  });

  await sendgrid.send({
    from: {
      email: 'test@ship.com',
      name: 'React email test',
    },
    to: 'e.chaban@paralect.com',
    subject: 'React email',
    html: emailHtml,
  });

  ctx.body = userService.getPublic(user);
}

export default (router: AppRouter) => {
  router.post('/sign-in', rateLimitMiddleware, validateMiddleware(schema), validator, handler);
};
