import { TokenType } from 'resources/tokens/tokens.schema';

import { tokensService } from 'db';

export default async function invalidateUserTokens(userId: string, type: TokenType): Promise<void> {
  await tokensService.deleteMany({ userId, type });
}
