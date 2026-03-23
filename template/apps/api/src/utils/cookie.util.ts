import _ from 'lodash';
import { URL } from 'node:url';
import { getPublicSuffix, parse } from 'tldts';

import config from 'config';

import logger from 'logger';

import { COOKIES } from 'app-constants';
import type { ORPCContext } from 'types';

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

interface SetTokensOptions {
  ctx: ORPCContext;
  accessToken: string;
  expiresIn: number;
}

const setTokens = async ({ ctx, accessToken, expiresIn }: SetTokensOptions) => {
  ctx.setCookie(COOKIES.ACCESS_TOKEN, accessToken, {
    domain: cookieDomain,
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + expiresIn * 1000),
    secure: ctx.secure,
    path: '/',
  });
};

interface UnsetTokensOptions {
  ctx: ORPCContext;
}

const unsetTokens = async ({ ctx }: UnsetTokensOptions) => {
  ctx.deleteCookie(COOKIES.ACCESS_TOKEN, {
    domain: cookieDomain,
    httpOnly: true,
    sameSite: 'lax',
    secure: ctx.secure,
    path: '/',
  });
};

export default {
  setTokens,
  unsetTokens,
};
