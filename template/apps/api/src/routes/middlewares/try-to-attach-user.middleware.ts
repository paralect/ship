import { userService } from 'resources/user';

import { authService } from 'services';

import { AppKoaContext, Next } from 'types';

const tryToAttachUser = async (ctx: AppKoaContext, next: Next) => {
  const { accessToken } = ctx.state;

  const token = await authService.validateAccessToken(accessToken);

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
