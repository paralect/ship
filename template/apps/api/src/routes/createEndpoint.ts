import type { Middleware } from 'koa';
import type { z, ZodType } from 'zod';

import type { AppKoaContext } from 'types';

import type { EndpointConfig, HttpMethod, TypedMiddleware } from './types';

// Path parameter extraction
type ExtractPathParams<T extends string> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractPathParams<`/${Rest}`>]: string }
  : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : Record<string, never>;

// Request type with params
type RequestWithParams<TPath extends string> =
  ExtractPathParams<TPath> extends Record<string, never> ? object : { params: ExtractPathParams<TPath> };

type AnyMiddleware = Middleware | TypedMiddleware;

export interface EndpointOptions<TPath extends string, TSchema extends ZodType = ZodType<unknown>, TResponse = void> {
  method: HttpMethod;
  path: TPath;
  schema?: TSchema;
  middlewares?: AnyMiddleware[];
  handler: (ctx: AppKoaContext<z.infer<TSchema>, RequestWithParams<TPath>>) => Promise<TResponse>;
}

// Result type that carries schema info for client-side inference
export interface EndpointResult<TSchema extends ZodType = ZodType<unknown>> {
  endpoint: EndpointConfig;
  handler: Middleware;
  schema?: TSchema;
  middlewares?: AnyMiddleware[];
}

export default function createEndpoint<
  TPath extends string,
  TSchema extends ZodType = ZodType<unknown>,
  TResponse = void,
>(options: EndpointOptions<TPath, TSchema, TResponse>): EndpointResult<TSchema> {
  const wrappedHandler = async (ctx: AppKoaContext) => {
    const result = await options.handler(ctx as never);
    if (result !== undefined) {
      ctx.body = result;
    }
  };

  return {
    endpoint: {
      method: options.method,
      path: options.path,
    } as EndpointConfig,
    handler: wrappedHandler as unknown as Middleware,
    schema: options.schema,
    middlewares: options.middlewares as unknown as Middleware[] | undefined,
  };
}
