import { z } from 'zod';

import { publicSchema } from '../users.schema';

import db from '@/db';
import { isAdmin } from '@/procedures';
import { listResultSchema, paginationSchema } from '@/resources/base.schema';

export default isAdmin
  .input(
    paginationSchema.extend({
      filter: z
        .object({
          createdOn: z
            .object({
              startDate: z.coerce.date().optional(),
              endDate: z.coerce.date().optional(),
            })
            .optional(),
        })
        .optional(),
      sort: z
        .object({
          firstName: z.enum(['asc', 'desc']).optional(),
          lastName: z.enum(['asc', 'desc']).optional(),
          createdOn: z.enum(['asc', 'desc']).default('asc'),
        })
        .default({ createdOn: 'asc' }),
    }),
  )
  .output(listResultSchema(publicSchema))
  .handler(async ({ input }) => {
    const { perPage, page, sort, searchValue, filter } = input;

    const createdOnFilter: Record<string, Date> = {};
    if (filter?.createdOn?.startDate) {
      createdOnFilter.gte = filter.createdOn.startDate;
    }
    if (filter?.createdOn?.endDate) {
      createdOnFilter.lt = filter.createdOn.endDate;
    }

    const where = {
      deletedOn: null,
      ...(searchValue && {
        OR: [
          { firstName: { ilike: `%${searchValue}%` } },
          { lastName: { ilike: `%${searchValue}%` } },
          { email: { ilike: `%${searchValue}%` } },
        ],
      }),
      ...(Object.keys(createdOnFilter).length && { createdOn: createdOnFilter }),
    };

    return db.users.findPage({ where, orderBy: sort, page, perPage });
  });
