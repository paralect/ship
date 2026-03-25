import type { SQL } from 'drizzle-orm';
import { and, asc, count, desc, gte, ilike, isNull, lt, or } from 'drizzle-orm';
import { z } from 'zod';

import { publicSchema } from '../users.schema';

import { db, users } from '@/db';
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

    const conditions: SQL[] = [isNull(users.deletedOn)];

    if (searchValue) {
      conditions.push(
        or(
          ilike(users.firstName, `%${searchValue}%`),
          ilike(users.lastName, `%${searchValue}%`),
          ilike(users.email, `%${searchValue}%`),
        )!,
      );
    }

    if (filter?.createdOn) {
      const { startDate, endDate } = filter.createdOn;
      if (startDate) conditions.push(gte(users.createdOn, startDate));
      if (endDate) conditions.push(lt(users.createdOn, endDate));
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const sortColumns = {
      firstName: users.firstName,
      lastName: users.lastName,
      createdOn: users.createdOn,
    } as const;

    const orderBy = Object.entries(sort)
      .filter(([, dir]) => dir)
      .map(([key, dir]) => {
        const col = sortColumns[key as keyof typeof sortColumns];
        return dir === 'desc' ? desc(col) : asc(col);
      });

    const offset = (page - 1) * perPage;

    const [results, [{ total }]] = await Promise.all([
      db
        .select()
        .from(users)
        .where(where)
        .orderBy(...orderBy)
        .limit(perPage)
        .offset(offset),
      db.select({ total: count() }).from(users).where(where),
    ]);

    return {
      results,
      count: total,
      pagesCount: Math.ceil(total / perPage),
    };
  });
