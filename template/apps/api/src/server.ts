import { serve } from '@hono/node-server';
import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { ORPCError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import config from '@/config';
import ioEmitter from '@/io-emitter';
import appLogger from '@/logger';
import redisClient, { redisErrorHandler } from '@/redis-client';
import { openApiRouter, router } from '@/router';
import serverConfig from '@/server-config';
import socketServer from '@/socket-server';
import type { CookieOptions, HonoEnv, ORPCContext } from '@/types';
import { AppError, ClientError } from '@/types';

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
    rawRequest: c.req.raw,
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

  await serverConfig.resolveUser(ctx);

  c.set('ctx', ctx);
  await next();
});

app.get('/health', (c) => c.json({ status: 'ok' }, 200));

// In-process OpenAPI docs (non-production only). `/spec.json` serves the spec
// generated live from the oRPC router; `/docs` renders the Scalar UI against
// it with an interactive "try it out". Registered before the oRPC catch-all
// so Hono matches them first.
if (config.APP_ENV !== 'production') {
  const openApiGenerator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });

  app.get('/spec.json', async (c) => {
    const spec = await openApiGenerator.generate(openApiRouter, {
      info: { title: 'Ship API', version: '1.0.0' },
      servers: [{ url: config.API_URL }],
    });
    return c.json(spec);
  });

  app.get('/docs', Scalar({ url: '/spec.json' }));
}

app.all('/api/auth/*', async (c) => {
  if (serverConfig.authHandler) {
    return serverConfig.authHandler(c.req.raw);
  }
  return c.json({ error: 'Auth not configured' }, 404);
});

const errorInterceptor = async <T>(options: { next: () => Promise<T> }): Promise<T> => {
  try {
    return await options.next();
  } catch (e) {
    if (e instanceof ORPCError && (e.code === 'UNAUTHORIZED' || e.code === 'FORBIDDEN')) {
      throw e;
    }

    // Expected client errors get warn-logged instead of error-logged.
    if (e instanceof ORPCError && ['BAD_REQUEST', 'NOT_FOUND', 'CONFLICT'].includes(e.code)) {
      appLogger.warn(`${e.code}: ${e.message}`);
      throw e;
    }

    appLogger.error(e);

    if (e instanceof ClientError) {
      throw new ORPCError('BAD_REQUEST', { status: e.status, data: { errors: e.errors }, cause: e });
    }
    if (e instanceof AppError) {
      throw new ORPCError('BAD_REQUEST', { status: e.status, message: e.message, cause: e });
    }
    throw e;
  }
};

const rpcHandler = new RPCHandler(router, {
  interceptors: [errorInterceptor],
});
const openApiHandler = new OpenAPIHandler(router, {
  interceptors: [errorInterceptor],
});

app.all('/*', async (c) => {
  const openApi = await openApiHandler.handle(c.req.raw, { context: c.var.ctx });
  if (openApi.matched) {
    return openApi.response;
  }

  const rpc = await rpcHandler.handle(c.req.raw, { context: c.var.ctx });
  if (rpc.matched) {
    return rpc.response;
  }

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
        socketServer(nodeServer as unknown as Parameters<typeof socketServer>[0]);
      })
      .catch(redisErrorHandler);
  }

  appLogger.info(`API server is listening on ${config.PORT} in ${config.APP_ENV} environment`);
})();

export default app;
