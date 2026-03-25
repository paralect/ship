import type { Context } from 'hono';
import { Template } from 'mailer';

import type { User } from '@/db';

export interface BackendFile {
  filepath: string;
  mimetype?: string | null;
  originalFilename?: string | null;
  newFilename: string;
  size: number;
}

type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : S extends `${infer P1}${infer P2}`
    ? `${Lowercase<P1>}${CamelCase<P2>}`
    : Lowercase<S>;

export type ToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends object ? ToCamelCase<T[K]> : T[K];
};

type JSONPrimitive = string | number | boolean;

export type CustomErrors = Record<string, JSONPrimitive>;

export type ValidationErrors = Record<string, JSONPrimitive | JSONPrimitive[]>;

export interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export { Template };

export type { Context };

export interface ORPCContext {
  user?: User;
  accessToken?: string;
  headers: Record<string, string>;
  getCookie: (name: string) => string | undefined;
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  deleteCookie: (name: string, options?: CookieOptions) => void;
  secure: boolean;
  signal?: AbortSignal;
}

export class ClientError extends Error {
  status: number;
  errors: ValidationErrors;

  constructor(errors: CustomErrors, status = 400) {
    const formatted: ValidationErrors = {};
    for (const [key, value] of Object.entries(errors)) {
      formatted[key] = Array.isArray(value) ? value : [value];
    }
    super(JSON.stringify(formatted));
    this.name = 'ClientError';
    this.status = status;
    this.errors = formatted;
  }
}

export class AppError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

export interface HonoEnv {
  Variables: {
    ctx: ORPCContext;
  };
}
