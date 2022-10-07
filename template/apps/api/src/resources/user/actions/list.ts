import Joi from 'joi';
import { SortDirection } from '@paralect/node-mongo';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';

const schema = Joi.object({
  page: Joi.number().default(1),
  perPage: Joi.number().default(10),
  sort: Joi.object({}).keys({
    createdOn: Joi.number(),
  }).default({ createdOn: -1 }),
  searchValue: Joi.string().allow(null, '').default(''),
});

type ValidatedData = {
  page: number;
  perPage: number;
  sort: {
    createdOn: SortDirection;
  };
  searchValue: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    perPage, page, sort, searchValue,
  } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  const users = await userService.find(
    {
      $or: [
        { firstName: { $regex: regExp } },
        { lastName: { $regex: regExp } },
        { email: { $regex: regExp } },
      ],
    },
    {
      page,
      perPage,
      sort,
    },
  );

  ctx.body = {
    items: users.results,
    totalPages: users.pagesCount,
    count: users.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
