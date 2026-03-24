import { pub } from 'procedures';
import { z } from 'zod';

import setAccessToken from 'resources/tokens/methods/setAccessToken';
import validateToken from 'resources/tokens/methods/validateToken';
import { TokenType } from 'resources/tokens/tokens.schema';
import { publicSchema } from 'resources/users/users.schema';

import { emailService } from 'services';

import config from 'config';

import { tokensService,usersService } from 'db';

import { ClientError, Template } from 'types';


export default pub
  .input(z.object({ token: z.string().min(1, 'Token is required') }))
  .output(
    z.object({
      accessToken: z.string(),
      user: publicSchema,
    }),
  )
  .handler(async ({ input, context }) => {
    const { token } = input;

    const emailVerificationToken = await validateToken(token, TokenType.EMAIL_VERIFICATION);
    const user = await usersService.findOne({ _id: emailVerificationToken?.userId });

    if (!emailVerificationToken || !user) {
      throw new ClientError({ token: 'Token is invalid or expired' });
    }

    await tokensService.deleteMany({ userId: user._id, type: TokenType.EMAIL_VERIFICATION });
    await usersService.updateOne({ _id: user._id }, () => ({ isEmailVerified: true }));

    const accessToken = await setAccessToken({ ctx: context, userId: user._id });

    await emailService.sendTemplate<typeof Template.SIGN_UP_WELCOME>({
      to: user.email,
      subject: 'Welcome to Ship Community!',
      template: Template.SIGN_UP_WELCOME,
      params: {
        firstName: user.firstName,
        href: `${config.WEB_URL}/sign-in`,
      },
    });

    return {
      accessToken,
      user,
    };
  });
