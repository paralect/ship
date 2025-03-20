import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { AppKoaContext, Next } from 'types';

const tryToAttachUser = async (ctx: AppKoaContext, next: Next) => {
  const { accessToken } = ctx.state;

  const token = await tokenService.findByJWTValue(accessToken);

  if (token) {
    const user = await userService.findOne({ _id: token.userId });

    if (user) {
      await userService.updateLastRequest(token.userId);

      ctx.state.user = user;
    }
  }

  return next();
};

export default tryToAttachUser;
