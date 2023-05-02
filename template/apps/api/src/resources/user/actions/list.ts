import { z } from 'zod';
import { SortDirection } from '@paralect/node-mongo';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
import { docsUtil } from 'utils';

const schema = z.object({
  page: z.string().transform(Number).default('1').openapi({ type: 'string' }),
  perPage: z.string().transform(Number).default('10').openapi({ type: 'string' }),
  sort: z.object({
    createdOn: z.string(),
  }).default({ createdOn: 'desc' }),
  filter: z.object({
    createdOn: z.object({
      sinceDate: z.string(),
      dueDate: z.string(),
    }).nullable().default(null),
  }).nullable().default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = Omit<z.infer<typeof schema>, 'sort'> & {
  sort: { [name: string]: SortDirection };
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue, filter,
  } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  const users = await userService.find(
    {
      $and: [
        {
          $or: [
            { firstName: { $regex: regExp } },
            { lastName: { $regex: regExp } },
            { email: { $regex: regExp } },
            { createdOn: {} },
          ],
        },
        filter?.createdOn ? {
          createdOn: {
            $gte: new Date(filter.createdOn.sinceDate as string),
            $lt: new Date(filter.createdOn.dueDate as string),
          },
        } : {},
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    items: users.results,
    totalPages: users.pagesCount,
    count: users.count,
  };
}

export default (router: AppRouter) => {
  docsUtil.registerDocs({
    private: true,
    tags: ['users'],
    method: 'get',
    path: '/users/',
    summary: 'List of users',
    description: 'Get all users in database paginated',
    request: {
      query: schema,
    },
    responses: {},
  });

  router.get('/', validateMiddleware(schema), handler);
};
