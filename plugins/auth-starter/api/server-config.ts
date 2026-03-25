import { COOKIES } from 'app-constants';

import db from '@/db';
import validateAccessToken from '@/resources/tokens/methods/validate-access-token';
import updateLastRequest from '@/resources/users/methods/update-last-request';
import type { ServerConfig } from '@/server-config';

const getCookie = (cookieString: string, name: string) => {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    const part = parts.pop();
    if (!part) return null;
    return part.split(';').shift() ?? null;
  }
  return null;
};

const authServerConfig: ServerConfig = {
  resolveUser: async (ctx) => {
    if (!ctx.accessToken) return;

    const token = await validateAccessToken({ value: ctx.accessToken });
    if (!token) return;

    const user = await db.users.findFirst({ where: { id: token.userId, deletedAt: null } });
    if (user) {
      await updateLastRequest({ userId: token.userId });
      ctx.user = user;
    }
  },

  socketAuth: async (cookieString) => {
    const accessToken = getCookie(cookieString, COOKIES.ACCESS_TOKEN);
    const token = await validateAccessToken({ value: accessToken });
    return token ? { userId: token.userId } : null;
  },
};

export default authServerConfig;
