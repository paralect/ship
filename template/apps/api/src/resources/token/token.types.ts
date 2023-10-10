import { z } from 'zod';

import schema from './token.schema';

export enum TokenType {
  ACCESS = 'access',
}

export type Token = z.infer<typeof schema>;
