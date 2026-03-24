import { serve } from '@hono/node-server';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { RPCHandler } from '@orpc/server/fetch';
import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { COOKIES } from 'app-constants';

import config from '@/config';
import { usersService } from '@/db';
import ioEmitter from '@/io-emitter';
import appLogger from '@/logger';
import redisClient, { redisErrorHandler } from '@/redis-client';
import validateAccessToken from '@/resources/tokens/methods/validate-access-token';
import updateLastRequest from '@/resources/users/methods/update-last-request';
import { router } from '@/router';
import { socketService } from '@/services';
import type { CookieOptions, HonoEnv, ORPCContext } from '@/types';

const app = new Hono<HonoEnv>();

app.use(cors({ origin: config.WEB_URL, credentials: true }));
app.use(secureHeaders());
app.use(honoLogger((message) => appLogger.http(message)));

app.use(async (c, next) => {
  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const ctx: ORPCContext = {
    headers,
    getCookie: (name: string) => getCookie(c, name),
    setCookie: (name: string, value: string, options?: CookieOptions) => {
      setCookie(c, name, value, {
        ...options,
        sameSite: options?.sameSite
          ? ((options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)) as 'Strict' | 'Lax' | 'None')
          : undefined,
      });
    },
    deleteCookie: (name: string, options?: CookieOptions) => {
      deleteCookie(c, name, {
        ...options,
        sameSite: options?.sameSite
          ? ((options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)) as 'Strict' | 'Lax' | 'None')
          : undefined,
      });
    },
    secure: c.req.url.startsWith('https'),
  };

  // Resolve auth from cookie or Authorization header
  let accessToken = getCookie(c, COOKIES.ACCESS_TOKEN);
  const authorization = c.req.header('authorization');

  if (!accessToken && authorization) {
    accessToken = authorization.replace('Bearer', '').trim();
  }

  if (accessToken) {
    ctx.accessToken = accessToken;

    const token = await validateAccessToken(accessToken);
    if (token) {
      const user = await usersService.findOne({ _id: token.userId });
      if (user) {
        await updateLastRequest(token.userId);
        ctx.user = user;
      }
    }
  }

  c.set('ctx', ctx);
  await next();
});

app.get('/health', (c) => c.json({ status: 'ok' }, 200));

const rpcHandler = new RPCHandler(router);
const openApiHandler = new OpenAPIHandler(router);

app.all('/*', async (c) => {
  const rpc = await rpcHandler.handle(c.req.raw, { context: c.var.ctx });
  if (rpc.matched) return rpc.response;

  const openApi = await openApiHandler.handle(c.req.raw, { context: c.var.ctx });
  if (openApi.matched) return openApi.response;

  return c.json({ error: 'Not found' }, 404);
});

(async () => {
  const nodeServer = serve({
    fetch: app.fetch,
    port: config.PORT,
  });

  if (config.REDIS_URI) {
    await redisClient
      .connect()
      .then(() => {
        ioEmitter.initClient();
        socketService(nodeServer as unknown as Parameters<typeof socketService>[0]);
      })
      .catch(redisErrorHandler);
  }

  appLogger.info(`API server is listening on ${config.PORT} in ${config.APP_ENV} environment`);
})();

export default app;
