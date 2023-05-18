import { z } from 'zod';

import config from 'config';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { User, userService } from 'resources/user';
import { docsService } from 'services';

import { schema } from './schema';
import docConfig from './doc';

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
  docsService.registerDocs(docConfig);

  router.get('/verify-reset-token', validateMiddleware(schema), validator);
};
