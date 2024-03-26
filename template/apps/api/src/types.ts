import Router from '@koa/router';
import { User } from 'app-types';
import Koa, { Next, ParameterizedContext, Request } from 'koa';
import { Template } from 'mailer';

export * from 'app-types';

export type AppKoaContextState = {
  user: User;
  accessToken: string;
  isShadow: boolean | null;
};

export type CustomErrors = {
  [name: string]: string;
};

export interface AppKoaContext<T = unknown, R = unknown> extends ParameterizedContext<AppKoaContextState> {
  request: Request & R;
  validatedData: T & object;
  throwError: (message: string) => never;
  assertError: (condition: unknown, message: string) => asserts condition;
  throwClientError: (errors: CustomErrors, status?: number) => never;
  assertClientError: (condition: unknown, errors: CustomErrors, status?: number) => asserts condition;
}

export class AppRouter extends Router<AppKoaContextState, AppKoaContext> {}

export class AppKoa extends Koa<AppKoaContextState, AppKoaContext> {}

export type AppRouterMiddleware = Router.Middleware<AppKoaContextState, AppKoaContext>;

export type ValidationErrors = {
  [name: string]: string[] | string;
};

export { Next, Template };
