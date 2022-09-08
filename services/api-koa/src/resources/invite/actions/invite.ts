import Joi from 'joi';

import config from 'config';
import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';
import { emailService } from 'services';

import { inviteService } from 'resources/invite';
import { userService } from 'resources/user';

const schema = Joi.object({
  emails: Joi.array()
    .items(Joi.string().email())
    .min(1)
    .unique()
    .messages({
      'array.min': 'Please, add at least one email.',
      'array.unique': 'Duplicated email',
      'string.email': 'Incorrect email format',
    })
});

type ValidatedData = {
  emails: string[];
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { emails } = ctx.validatedData;

  const { results: existingUsers } = await userService.find({ email: { $in: emails } });
  ctx.assertClientError(!existingUsers.length, {
    emails: `Users with ${existingUsers.map((item) => item.email).join(', ')} emails are already exists`,
  });

  const { results: existingInvites } = await inviteService.find({ email: { $in: emails } });
  ctx.assertClientError(!existingInvites.length, {
    emails: `Users with ${existingInvites.map((item) => item.email).join(', ')} emails are already invited`
  })

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
    }
  }));

  await inviteService.insertMany(data);

  await Promise.all(data.map(async (item) => {
    await emailService.sendInvite(item.email, {
      sender: user.fullName,
      signUpUrl: `${config.webUrl}/sign-up/?token=${item.token}`,
    });
  }))

  ctx.body = config.isDev ? data : {};
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
