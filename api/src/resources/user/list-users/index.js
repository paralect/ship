const Joi = require('joi');

const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');

const schema = Joi.object({
  limit: Joi.number().required(),
  page: Joi.number().required(),
  sortKey: Joi.string().trim().required(),
  sortDirection: Joi.number().required(),
});

async function handler(ctx) {
  const {
    limit, page, sortKey, sortDirection,
  } = ctx.validatedData;

  const users = await userService.find(
    {},
    { page, perPage: limit, sort: { [sortKey]: sortDirection } },
  );

  ctx.body = {
    items: users.results,
    totalPages: users.pagesCount,
    currentPage: page,
  };
}

module.exports.register = (router) => {
  router.get('/user', validate(schema), handler);
};