import { AppKoaContext, Next } from 'types';
import { userService } from 'resources/user';
import { tokenService } from 'resources/token';

const tryToAttachUser = async (ctx: AppKoaContext, next: Next) => {
  let userData;

  if (ctx.state.accessToken) {
    userData = await tokenService.findTokenByValue(ctx.state.accessToken);
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
