import { z } from 'zod';

import { publicSchema } from '../users.schema';

import db from '@/db';
import { isAdmin } from '@/procedures';
import { listResultSchema, paginationSchema } from '@/resources/base.schema';

export default isAdmin
  .route({ method: 'GET', path: '/users' })
  .input(
    paginationSchema.extend({
      filter: z
        .object({
          createdAt: z
            .object({
              startDate: z.coerce.date().optional(),
              endDate: z.coerce.date().optional(),
            })
            .optional(),
        })
        .optional(),
      sort: z
        .object({
          fullName: z.enum(['asc', 'desc']).optional(),
          createdAt: z.enum(['asc', 'desc']).default('asc'),
        })
        .default({ createdAt: 'asc' }),
    }),
  )
  .output(listResultSchema(publicSchema))
  .handler(async ({ input }) => {
    const { perPage, page, sort, searchValue, filter } = input;

    const createdAtFilter: Record<string, Date> = {};
    if (filter?.createdAt?.startDate) {
      createdAtFilter.gte = filter.createdAt.startDate;
    }
    if (filter?.createdAt?.endDate) {
      createdAtFilter.lt = filter.createdAt.endDate;
    }

    const where = {
      deletedAt: null,
      ...(searchValue && {
        OR: [
          { fullName: { ilike: `%${searchValue}%` } },
          { email: { ilike: `%${searchValue}%` } },
        ],
      }),
      ...(Object.keys(createdAtFilter).length && { createdAt: createdAtFilter }),
    };

    return db.users.findPage({ where, orderBy: sort, page, perPage });
  });
