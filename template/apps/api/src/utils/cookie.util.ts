import _ from 'lodash';
import { getPublicSuffix, parse } from 'tldts';
import { URL } from 'url';

import config from 'config';

import { COOKIES } from 'app-constants';
import { AppKoaContext } from 'types';

/**
 * Determines a valid cookie domain.
 * Returns undefined for localhost or invalid domains.
 */
const getCookieDomain = (hostname: string): string | undefined => {
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return undefined;
  }

  const { domain, subdomain } = parse(hostname);

  if (!domain) {
    logger.warn(`Cannot determine cookie domain from "${hostname}".`);
    return undefined;
  }

  // Drop left-most subdomain and keep the rest
  const cookieSubdomain = _.tail(subdomain?.split('.')).join('.');

  const cookieDomain = cookieSubdomain ? `${cookieSubdomain}.${domain}` : domain;

  const publicSuffix = getPublicSuffix(cookieDomain, { allowPrivateDomains: true });

  // Check if domain is a public suffix (e.g. ondigitalocean.app)
  if (!publicSuffix || cookieDomain === publicSuffix) {
    logger.warn(`"${cookieDomain}" is a public suffix. Cookie won't be set.`);
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
};

interface SetTokensOptions {
  ctx: AppKoaContext;
  accessToken: string;
  expiresIn: number;
}

const setTokens = async ({ ctx, accessToken, expiresIn }: SetTokensOptions) => {
  ctx.cookies.set(
    COOKIES.ACCESS_TOKEN,
    accessToken,
    Object.assign(baseCookieOptions, {
      expires: new Date(Date.now() + expiresIn * 1000),
      secure: ctx.secure,
    }),
  );
};

interface UnsetTokensOptions {
  ctx: AppKoaContext;
}

const unsetTokens = async ({ ctx }: UnsetTokensOptions) => {
  ctx.cookies.set(
    COOKIES.ACCESS_TOKEN,
    null,
    Object.assign(baseCookieOptions, {
      maxAge: 0,
      secure: ctx.secure,
    }),
  );
};

export default {
  setTokens,
  unsetTokens,
};
