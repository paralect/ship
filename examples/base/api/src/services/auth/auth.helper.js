const psl = require('psl');
const url = require('url');
const config = require('config');
const { COOKIES } = require('app.constants');

exports.setTokenCookies = ({
  ctx,
  accessToken,
}) => {
  const parsedUrl = url.parse(config.webUrl);
  const parsed = psl.parse(parsedUrl.hostname);
  const cookiesDomain = parsed.domain;

  ctx.cookies.set(COOKIES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    domain: cookiesDomain,
    expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
  });
};

exports.unsetTokenCookies = (ctx) => {
  ctx.cookies.set(COOKIES.ACCESS_TOKEN);
};
