import { getAuth } from '@/auth';
import db from '@/db';
import updateLastRequest from '@/resources/users/methods/update-last-request';
import type { ORPCContext } from '@/types';

interface ServerConfig {
  resolveUser: (ctx: ORPCContext) => Promise<void>;
  socketAuth: (cookie: string) => Promise<{ userId: string } | null>;
  authHandler?: (request: Request) => Promise<Response> | Response;
}

const authServerConfig: ServerConfig = {
  resolveUser: async (ctx) => {
    if (!ctx.rawRequest) return;

    const session = await getAuth().api.getSession({
      headers: ctx.rawRequest.headers,
    });

    if (session?.user) {
      await updateLastRequest({ userId: session.user.id });

      const user = await db.users.findOne({ _id: session.user.id });
      if (user) ctx.user = user;
    }
  },

  socketAuth: async (cookieString) => {
    const headers = new Headers();
    headers.set('cookie', cookieString);

    const session = await getAuth().api.getSession({ headers });
    return session?.user ? { userId: session.user.id } : null;
  },

  authHandler: (request) => getAuth().handler(request),
};

export default authServerConfig;
