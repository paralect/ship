import { pub } from 'procedures';
import { z } from 'zod';

import { passwordSchema } from 'resources/base.schema';
import { tokenService } from 'resources/token';
import { TokenType } from 'resources/token/token.schema';
import { userService } from 'resources/users';

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

    const resetPasswordToken = await tokenService.validateToken(token, TokenType.RESET_PASSWORD);
    const user = await userService.findOne({ _id: resetPasswordToken?.userId });

    if (!resetPasswordToken || !user) return {};

    const passwordHash = await securityUtil.hashPassword(password);

    await tokenService.invalidateUserTokens(user._id, TokenType.RESET_PASSWORD);
    await userService.updateOne({ _id: user._id }, () => ({ passwordHash }));

    return {};
  });
