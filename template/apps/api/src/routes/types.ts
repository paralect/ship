import type { Middleware } from 'koa';
import type { ZodSchema } from 'zod';

import type { AppKoaContext, Next } from 'types';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface EndpointConfig {
  method: HttpMethod;
  path: string;
}

export interface EndpointDefinition {
  endpoint: EndpointConfig;
  handler: Middleware;
  schema?: ZodSchema;
  middlewares?: (Middleware | TypedMiddleware)[];
}

// Middleware that declares what it adds to state
export interface TypedMiddleware<TState = object> {
  (ctx: AppKoaContext, next: Next): Promise<void>;
  _state?: TState; // phantom type, never used at runtime
}
