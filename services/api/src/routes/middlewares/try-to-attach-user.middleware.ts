import userService from 'resources/user/user.service';
import tokenService from 'resources/token/token.service';
import { AppKoaContext, Next } from 'types';

const tryToAttachUser = async (ctx: AppKoaContext, next: Next) => {
  let userData;

  if (ctx.state.accessToken) {
    userData = await tokenService.findTokenByValue(ctx.state.accessToken);
  }

  if (userData && userData.userId) {
    await userService.updateLastRequest(userData.userId);
    const user = await userService.findOne({ _id: userData.userId });
    if (user) {
      ctx.state.user = user;
    }
  }

  return next();
};

export default tryToAttachUser;
