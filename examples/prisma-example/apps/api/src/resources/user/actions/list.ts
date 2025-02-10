import { z } from 'zod';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

import { paginationSchema } from 'schemas';
import { AppKoaContext, AppRouter, NestedKeys, User } from 'types';

const schema = paginationSchema.extend({
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
      firstName: z.enum(['asc', 'desc']).optional(),
      lastName: z.enum(['asc', 'desc']).optional(),
      createdAt: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({}),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {

  const { perPage, page, sort, searchValue, filter } = ctx.validatedData;

  const filterOptions = [];

  if (searchValue) {
    const searchFields: NestedKeys<User>[] = ['firstName', 'lastName', 'email'];

    filterOptions.push({
      OR: searchFields.map((field) => ({
        [field]: {
          contains: searchValue,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (filter) {
    const { createdAt, ...otherFilters } = filter;

    if (createdAt) {
      const { startDate, endDate } = createdAt;

      filterOptions.push({
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lt: endDate }),
        },
      });
    }

    Object.entries(otherFilters).forEach(([key, value]) => {
      filterOptions.push({ [key]: value });
    });
  }

  const orderBy = Object.entries(sort).map(([key, value]) => ({
    [key]: value,
  }));

  const result = await userService.findMany({
    where: {
      AND: filterOptions,
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy,
  });

  ctx.body = { ...result, results: result.map(userService.getPublic) };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
