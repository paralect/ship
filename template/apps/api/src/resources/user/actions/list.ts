import { z } from 'zod';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { stringUtil } from 'utils';

import { paginationSchema } from 'schemas';
import { AppKoaContext, AppRouter, NestedKeys, User } from 'types';

const schema = paginationSchema.extend({
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
    .default({}),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { perPage, page, sort, searchValue, filter } = ctx.validatedData;

  const filterOptions = [];

  if (searchValue) {
    const searchPattern = stringUtil.escapeRegExpString(searchValue);

    const searchFields: NestedKeys<User>[] = ['firstName', 'lastName', 'email'];

    filterOptions.push({
      $or: searchFields.map((field) => ({ [field]: { $regex: searchPattern } })),
    });
  }

  if (filter) {
    const { createdOn, ...otherFilters } = filter;

    if (createdOn) {
      const { startDate, endDate } = createdOn;

      filterOptions.push({
        createdOn: {
          ...(startDate && { $gte: startDate }),
          ...(endDate && { $lt: endDate }),
        },
      });
    }

    Object.entries(otherFilters).forEach(([key, value]) => {
      filterOptions.push({ [key]: value });
    });
  }

  ctx.body = await userService.find(
    { ...(filterOptions.length && { $and: filterOptions }) },
    { page, perPage },
    { sort },
  );
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
