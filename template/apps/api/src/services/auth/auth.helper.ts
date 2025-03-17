import { getPublicSuffix, parse } from 'tldts';
import { URL } from 'url';

import config from 'config';

import { COOKIES, TOKEN_SECURITY_EXPIRES_IN } from 'app-constants';
import { AppKoaContext } from 'types';

/**
 * Determines a valid cookie domain.
 * Returns undefined for localhost or invalid domains.
 */
const getCookieDomain = (hostname: string): string | undefined => {
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    // Allow cookies to be set without domain in local development.
    return undefined;
  }

  const { publicSuffix, domain } = parse(hostname);

  if (!publicSuffix || !domain) {
    logger.warn(`Cannot determine cookie domain from hostname "${hostname}".`);
    return undefined;
  }

  const cookieDomain = `${domain}.${publicSuffix}`;

  // Check if domain is a public suffix (e.g. ondigitalocean.app)
  if (domain === getPublicSuffix(domain)) {
    logger.warn(`Detected "${cookieDomain}" as public suffix. Cookies won't be set.`);
    return undefined;
  }

  return cookieDomain;
};

interface SetTokenCookiesParams {
  ctx: AppKoaContext;
  accessToken: string;
}

export const setTokenCookies = ({ ctx, accessToken }: SetTokenCookiesParams) => {
  const webUrl = new URL(config.WEB_URL);
  const cookieDomain = getCookieDomain(webUrl.hostname);

  ctx.cookies.set(COOKIES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: webUrl.protocol === 'https:',
    domain: cookieDomain,
    expires: new Date(Date.now() + TOKEN_SECURITY_EXPIRES_IN * 1000),
    sameSite: 'lax',
  });
};

export const unsetTokenCookies = (ctx: AppKoaContext) => {
  const webUrl = new URL(config.WEB_URL);
  const cookiesDomain = getCookieDomain(webUrl.hostname);

  ctx.cookies.set(COOKIES.ACCESS_TOKEN, null, {
    domain: cookiesDomain,
    httpOnly: true,
    secure: webUrl.protocol === 'https:',
    expires: new Date(0),
    sameSite: 'lax',
  });
};

export default {
  setTokenCookies,
  unsetTokenCookies,
};
