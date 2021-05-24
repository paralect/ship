const tokenService = require('resources/token/token.service');
const cookieHelper = require('helpers/cookie.helper');

exports.setTokens = async (ctx, userId) => {
  const res = await tokenService.createAuthTokens({ userId });

  const options = {
    ctx,
    ...res,
  };

  cookieHelper.setTokenCookies(options);
};

exports.unsetTokens = async (ctx) => {
  await tokenService.removeAuthTokens(ctx.state.accessToken, ctx.state.refreshToken);
  cookieHelper.unsetTokenCookies(ctx);
};
