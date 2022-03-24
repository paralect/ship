const Joi = require('joi');

const validate = require('middlewares/validate.middleware');
const userService = require('resources/user/user.service');

const schema = Joi.object({
  page: Joi.number().default(1),
  perPage: Joi.number().default(10),
  sort: Joi.object({}).keys({
    createdOn: Joi.number(),
  }).default({ createdOn: -1 }),
  searchValue: Joi.string().allow(null, '').default(''),
});

async function handler(ctx) {
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

module.exports.register = (router) => {
  router.get('/', validate(schema), handler);
};
