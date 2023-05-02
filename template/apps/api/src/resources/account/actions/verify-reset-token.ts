import { z } from 'zod';

import config from 'config';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { User, userService } from 'resources/user';
import { docsUtil } from 'utils';

const schema = z.object({
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  token: z.string().min(1, 'Token is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>) {
  const { email, token } = ctx.validatedData;

  const user = await userService.findOne({ resetPasswordToken: token });

  const redirectUrl = user
    ? `${config.webUrl}/reset-password?token=${token}`
    : `${config.webUrl}/expire-token?email=${email}`;

  ctx.redirect(redirectUrl);
}

export default (router: AppRouter) => {
  docsUtil.registerDocs({
    private: false,
    tags: ['account'],
    method: 'get',
    path: '/account/verify-reset-token',
    summary: 'Verify reset token',
    description: 'Check reset token',
    request: {
      query: schema,
    },
    responses: {
      302: {
        description: 'Redirect to reset password page',
      },
    },
  });

  router.get('/verify-reset-token', validateMiddleware(schema), validator);
};
