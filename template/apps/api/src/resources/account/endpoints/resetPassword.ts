import { pub } from 'procedures';
import { z } from 'zod';

import { passwordSchema } from 'resources/base.schema';
import { TokenType } from 'resources/tokens/tokens.schema';
import validateToken from 'resources/tokens/methods/validateToken';
import invalidateUserTokens from 'resources/tokens/methods/invalidateUserTokens';
import { usersService } from 'db';

import { securityUtil } from 'utils';

const emptyOutput = z.object({});

export default pub
  .input(
    z.object({
      token: z.string().min(1, 'Token is required'),
      password: passwordSchema,
    }),
  )
  .output(emptyOutput)
  .handler(async ({ input }) => {
    const { token, password } = input;

    const resetPasswordToken = await validateToken(token, TokenType.RESET_PASSWORD);
    const user = await usersService.findOne({ _id: resetPasswordToken?.userId });

    if (!resetPasswordToken || !user) return {};

    const passwordHash = await securityUtil.hashPassword(password);

    await invalidateUserTokens(user._id, TokenType.RESET_PASSWORD);
    await usersService.updateOne({ _id: user._id }, () => ({ passwordHash }));

    return {};
  });
