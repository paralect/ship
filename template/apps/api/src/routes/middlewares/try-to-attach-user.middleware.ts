import { tokenService } from 'resources/token';
import { userService } from 'resources/user';

import { AppKoaContext, Next } from 'types';

const tryToAttachUser = async (ctx: AppKoaContext, next: Next) => {
  const { accessToken } = ctx.state;
  let userData;

  if (accessToken) {
    userData = await tokenService.findTokenByValue(accessToken);
  }

  if (userData && userData.userId) {
    const user = await userService.findOne({ _id: userData.userId });

    if (user) {
      await userService.updateLastRequest(userData.userId);

      ctx.state.user = user;
      ctx.state.isShadow = userData.isShadow || false;
    }
  }

  return next();
};

export default tryToAttachUser;
