import { pub } from 'procedures';
import { z } from 'zod';

import { passwordSchema } from 'resources/base.schema';
import validateToken from 'resources/tokens/methods/validate-token';
import { TokenType } from 'resources/tokens/tokens.schema';

import { securityUtil } from 'utils';

import { tokensService, usersService } from 'db';

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

    const resetPasswordToken = await validateToken({ token, type: TokenType.RESET_PASSWORD });
    const user = await usersService.findOne({ _id: resetPasswordToken?.userId });

    if (!resetPasswordToken || !user) return {};

    const passwordHash = await securityUtil.hashPassword(password);

    await tokensService.deleteMany({ userId: user._id, type: TokenType.RESET_PASSWORD });
    await usersService.updateOne({ _id: user._id }, () => ({ passwordHash }));

    return {};
  });
