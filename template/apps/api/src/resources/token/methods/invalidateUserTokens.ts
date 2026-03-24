import { TokenType } from 'resources/token/token.schema';

import tokenService from 'resources/token/token.service';

export default async function invalidateUserTokens(userId: string, type: TokenType): Promise<void> {
  await tokenService.deleteMany({ userId, type });
}
