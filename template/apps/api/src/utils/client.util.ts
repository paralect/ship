import { COOKIES } from 'app-constants';
import { AppKoaContext } from 'types';

export enum ClientType {
  WEB = 'web',
  MOBILE = 'mobile',
}

export const detectClientType = (ctx: AppKoaContext): ClientType => {
  const hasCookieToken = !!ctx.cookies.get(COOKIES.ACCESS_TOKEN);
  const hasBearerToken = !!ctx.headers.authorization?.startsWith('Bearer ');
  const clientTypeHeader = ctx.headers['x-client-type']?.toString().toLowerCase();
  const userAgent = ctx.headers['user-agent']?.toString().toLowerCase() || '';

  if (hasCookieToken) {
    return ClientType.WEB;
  }

  if (hasBearerToken && !hasCookieToken) {
    return ClientType.MOBILE;
  }

  if (clientTypeHeader === 'mobile') {
    return ClientType.MOBILE;
  }

  const isMobileUserAgent = userAgent.includes('flutter') || userAgent.includes('dart') || userAgent.includes('mobile');

  if (isMobileUserAgent && !hasCookieToken) {
    return ClientType.MOBILE;
  }

  return ClientType.WEB;
};
