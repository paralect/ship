import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db, users } from '@/db';
import { isAuthorized } from '@/procedures';
import removeAvatar from '@/resources/auth/methods/remove-avatar';
import uploadAvatar from '@/resources/auth/methods/upload-avatar';
import { passwordSchema } from '@/resources/base.schema';
import usersSchema, { publicSchema } from '@/resources/users/users.schema';
import { securityUtil } from '@/utils';

export default isAuthorized
  .input(
    usersSchema
      .pick({ firstName: true, lastName: true })
      .extend({
        password: z.union([passwordSchema, z.literal('')]),
        avatar: z.union([z.any(), z.literal('')]).nullable(),
      })
      .partial(),
  )
  .output(publicSchema)
  .handler(async ({ input, context }) => {
    const { user } = context;
    const { password, avatar, ...rest } = input;

    const updateData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) updateData[key] = value;
    }

    if (password) {
      updateData.passwordHash = await securityUtil.hashPassword(password);
    }

    if (avatar === '') {
      await removeAvatar(user);
      updateData.avatarUrl = null;
    }

    if (avatar && avatar !== '') {
      updateData.avatarUrl = await uploadAvatar({ user, file: avatar });
    }

    if (Object.keys(updateData).length === 0) {
      return user;
    }

    const [updated] = await db.update(users).set(updateData).where(eq(users.id, user.id)).returning();

    return updated!;
  });
