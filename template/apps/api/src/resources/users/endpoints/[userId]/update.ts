import { ORPCError } from '@orpc/server';
import { z } from 'zod';

import db from '@/db';
import endpoint from '@/endpoint';
import isAdmin from '@/middlewares/is-admin';
import { publicSchema } from '@/resources/users/users.schema';

export default endpoint
  .use(isAdmin)
  .input(
    z.object({
      userId: z.string().min(1),
      fullName: z.string().min(1).max(128).optional(),
      isAdmin: z.boolean().optional(),
    }),
  )
  .output(publicSchema)
  .handler(async ({ input }) => {
    const { userId, ...data } = input;

    const user = await db.users.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user) {
      throw new ORPCError('NOT_FOUND', { message: 'User not found' });
    }

    const updateData: Record<string, unknown> = {};
    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }
    if (data.isAdmin !== undefined) {
      updateData.isAdmin = data.isAdmin;
    }

    if (Object.keys(updateData).length === 0) {
      return user;
    }

    const updatedUser = await db.users.updateOne({ id: userId }, updateData);
    return updatedUser!;
  });
