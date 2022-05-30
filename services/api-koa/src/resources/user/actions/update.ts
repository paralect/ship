import Joi from 'joi';
import validate from 'middlewares/validate.middleware';
import userService from 'resources/user/user.service';
import { securityUtil } from 'utils';
import { Next, AppKoaContext, AppRouter } from 'types';

const schema = Joi.object({
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
});

type ValidatedData = {
  firstName: string,
  lastName: string,
  email: string
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { firstName, lastName, email } = ctx.validatedData;
  const updatedUser = await userService.update({ _id: ctx.request.params?.id }, () => ({ firstName, lastName, email }));
  if (!updatedUser) {
    ctx.throw(404);
  }

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/:id', validate(schema), handler);
};