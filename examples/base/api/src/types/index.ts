import Router from '@koa/router';
import Koa from 'koa';
import { ParameterizedContext, Request, Next } from 'koa';
import { User } from 'resources/user';

interface AppKoaRequest<RequestBody = unknown> extends Request {
  body?: RequestBody;
  params?: Record<string, string>;
}

export type AppKoaContextState = {
  user: User;
  accessToken: string;
};

export type CustomErrors = {
  [name: string]: string;
};

export interface AppKoaContext<T = unknown> extends ParameterizedContext<AppKoaContextState> {
  request: AppKoaRequest<Record<string, string>>;
  validatedData: T;
  throwError: (message: string) => never;
  assertError: (condition: unknown, message: string) => asserts condition;
  throwClientError: (errors: CustomErrors, status?: number) => never;
  assertClientError: (condition: unknown, errors: CustomErrors, status?: number) => asserts condition;
}

export class AppRouter extends Router<AppKoaContextState, AppKoaContext> {}

export class AppKoa extends Koa<AppKoaContextState, AppKoaContext<unknown>> {}

export type AppRouterMiddleware = Router.Middleware<AppKoaContextState, AppKoaContext>;

export type ValidationErrors = {
  [name: string]: string[] | string;
};

export { 
  Next,
};
