import { UserPublicSchema } from '../../user/schemas/userPublic.schema';
import { z } from 'zod';
import { docsService } from 'services';

export const GetAccountSchema = UserPublicSchema.extend({
  isShadow: z.boolean(),
});
docsService.registerSchema('GetAccount', GetAccountSchema);

