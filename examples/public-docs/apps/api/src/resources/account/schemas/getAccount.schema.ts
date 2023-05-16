import { UserPublicSchema } from '../../user/schemas/userPublic.schema';
import { z } from 'zod';
import { docsService } from 'services';

export const GetAccountSchema = docsService.registerSchema(
  'GetAccount',
  UserPublicSchema.extend({
    isShadow: z.boolean(),
  }),
);
