import { eq } from 'drizzle-orm';
import { z } from 'zod';

import usersSchema, { publicSchema } from '../users.schema';

import { db, users } from '@/db';
import { isAdmin, shouldExist } from '@/procedures';

export default isAdmin
  .input(
    z.object({
      id: z.string(),
      data: usersSchema.pick({ firstName: true, lastName: true, email: true }),
    }),
  )
  .use(
    shouldExist(async (id) => {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return user ?? null;
    }, 'User'),
  )
  .output(publicSchema)
  .handler(async ({ input }) => {
    const { id, data } = input;

    const nonEmptyValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) nonEmptyValues[key] = value;
    }

    const [updatedUser] = await db.update(users).set(nonEmptyValues).where(eq(users.id, id)).returning();

    return updatedUser!;
  });
