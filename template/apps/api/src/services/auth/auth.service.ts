import { getPublicSuffix, parse } from 'tldts';
import { URL } from 'url';

import { tokenService } from 'resources/token';

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
    logger.warn(`Detected "${cookieDomain}" as public suffix. Cookie won't be set.`);
    return undefined;
  }

  return cookieDomain;
};

const webUrl = new URL(config.WEB_URL);
const cookieDomain = getCookieDomain(webUrl.hostname);
const baseCookieOptions = {
  domain: cookieDomain,
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: webUrl.protocol === 'https:',
};

const setTokens = async (ctx: AppKoaContext, userId: string, isShadow?: boolean) => {
  const { accessToken } = await tokenService.createAuthTokens({ userId, isShadow });

  if (accessToken) {
    ctx.cookies.set(
      COOKIES.ACCESS_TOKEN,
      accessToken,
      Object.assign(baseCookieOptions, {
        expires: new Date(Date.now() + TOKEN_SECURITY_EXPIRES_IN * 1000),
      }),
    );
  }
};

const unsetTokens = async (ctx: AppKoaContext) => {
  await tokenService.removeAuthTokens(ctx.state.accessToken);

  ctx.cookies.set(
    COOKIES.ACCESS_TOKEN,
    null,
    Object.assign(baseCookieOptions, {
      expires: new Date(0),
    }),
  );
};

export default {
  setTokens,
  unsetTokens,
};
