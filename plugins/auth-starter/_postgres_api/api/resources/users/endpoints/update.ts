import { z } from 'zod';

import usersSchema, { publicSchema } from '../users.schema';

import db from '@/db';
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
      const user = await db.users.findFirst({ where: { id } });
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

    const updatedUser = await db.users.updateOne({ id }, nonEmptyValues);

    return updatedUser!;
  });
