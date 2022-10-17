import { z } from 'zod';

import config from 'config';
import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';
import { emailService } from 'services';

import { inviteService } from 'resources/invite';
import { userService } from 'resources/user';

const schema = z.object({
  emails: z.array(z.string().email())
    .min(1, 'Please, add at least one email'),
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { emails } = ctx.validatedData;

  const { results: existingUsers } = await userService.find({ email: { $in: emails } });
  ctx.assertClientError(!existingUsers.length, {
    emails: `Users with ${existingUsers.map((item) => item.email).join(', ')} emails already exist`,
  });

  const { results: existingInvites } = await inviteService.find({ email: { $in: emails } });
  ctx.assertClientError(!existingInvites.length, {
    emails: `Users with ${existingInvites.map((item) => item.email).join(', ')} emails already invited`,
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { emails } = ctx.validatedData;

  const data = await Promise.all(emails.map(async (email) => {
    const token = await securityUtil.generateSecureToken();

    return {
      email,
      token,
      invitedBy: user._id,
    };
  }));

  await inviteService.insertMany(data);

  await Promise.all(data.map((item) => {
    emailService.sendInvite(item.email, {
      sender: user.fullName,
      signUpUrl: `${config.webUrl}/sign-up/?token=${item.token}`,
    });
  }));

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
