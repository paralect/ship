import Router from '@koa/router';
import Koa, { Next, ParameterizedContext, Request } from 'koa';
import { Template } from 'mailer';
import type { User } from 'shared';

// File types
export interface BackendFile {
  filepath: string;
  mimetype?: string | null;
  originalFilename?: string | null;
  newFilename: string;
  size: number;
}

// Utility types
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends (...args: never[]) => unknown
          ? never
          : `${K}` | (Path<T[K]> extends infer R ? (R extends never ? never : `${K}.${R & string}`) : never)
        : never;
    }[keyof T]
  : never;

export type NestedKeys<T> = Path<Required<T>>;

type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : S extends `${infer P1}${infer P2}`
    ? `${Lowercase<P1>}${CamelCase<P2>}`
    : Lowercase<S>;

export type ToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends object ? ToCamelCase<T[K]> : T[K];
};

export interface AppKoaContextState {
  user: User;
  accessToken: string;
  [key: string]: unknown;
}

type JSONPrimitive = string | number | boolean;

export type CustomErrors = Record<string, JSONPrimitive>;

export interface AppKoaContext<T = unknown, R = unknown> extends ParameterizedContext<AppKoaContextState> {
  request: Request & R;
  validatedData: T & object;
  throwError: (message: string, status?: number) => never;
  assertError: (condition: unknown, message: string, status?: number) => asserts condition;
  throwClientError: (errors: CustomErrors, status?: number) => never;
  assertClientError: (condition: unknown, errors: CustomErrors, status?: number) => asserts condition;
  throwGlobalErrorWithRedirect: (message: string, redirectUrl?: string) => void;
}

export class AppRouter extends Router<AppKoaContextState, AppKoaContext> {}

export class AppKoa extends Koa<AppKoaContextState, AppKoaContext> {}

export type AppRouterMiddleware = Router.Middleware<AppKoaContextState, AppKoaContext>;

export type ValidationErrors = Record<string, JSONPrimitive | JSONPrimitive[]>;

export { Template };

export type { Next };
