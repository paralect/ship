import type { Middleware } from 'koa';
import type { z, ZodSchema, ZodType } from 'zod';

import type { AppKoaContext, Next } from 'types';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface EndpointConfig {
  method: HttpMethod;
  path: string;
}

type RouteMiddleware = Middleware;

export interface EndpointDefinition {
  endpoint: EndpointConfig;
  handler: RouteMiddleware;
  schema?: ZodSchema;
  middlewares?: RouteMiddleware[];
}

// Path parameter extraction
type ExtractPathParams<T extends string> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractPathParams<`/${Rest}`>]: string }
  : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : Record<string, never>;

// Request type with params
type RequestWithParams<TPath extends string> = ExtractPathParams<TPath> extends Record<string, never>
  ? object
  : { params: ExtractPathParams<TPath> };

// Middleware that declares what it adds to state
export interface TypedMiddleware<TState = object> {
  (ctx: AppKoaContext, next: Next): Promise<void>;
  _state?: TState; // phantom type, never used at runtime
}

// Helper to define middleware with state type
// Accepts any context type for flexibility in validators
// eslint-disable-next-line ts/no-explicit-any
export function createMiddleware<TState = object>(
  fn: (ctx: any, next: Next) => Promise<void>,
): TypedMiddleware<TState> {
  return fn as TypedMiddleware<TState>;
}

export interface EndpointOptions<
  TPath extends string,
  TSchema extends ZodType = ZodType<unknown>,
  TResponse = void,
> {
  method: HttpMethod;
  path: TPath;
  schema?: TSchema;
  middlewares?: RouteMiddleware[];
  handler: (
    ctx: AppKoaContext<z.infer<TSchema>, RequestWithParams<TPath>>,
  ) => Promise<TResponse>;
}

// Result type that carries schema info for client-side inference
export interface EndpointResult<
  TSchema extends ZodType = ZodType<unknown>,
> {
  endpoint: EndpointConfig;
  handler: RouteMiddleware;
  schema?: TSchema;
  middlewares?: RouteMiddleware[];
}

export function createEndpoint<
  TPath extends string,
  TSchema extends ZodType = ZodType<unknown>,
  TResponse = void,
>(
  options: EndpointOptions<TPath, TSchema, TResponse>,
): EndpointResult<TSchema> {
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
    handler: wrappedHandler as unknown as RouteMiddleware,
    schema: options.schema,
    middlewares: options.middlewares as unknown as RouteMiddleware[] | undefined,
  };
}
