import { z } from 'zod';
import { emailSchema, paginationSchema, passwordSchema, userSchema } from '../schemas';
import { ApiClient } from '../client';

export const schemas = {
  account: {
    forgotPassword: z.object({
  email: emailSchema,
}),
    googleMobile: z.object({
  idToken: z.string().min(1, 'ID token is required'),
}),
    resendEmail: z.object({
  email: emailSchema,
}),
    resetPassword: z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
}),
    signIn: z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Password must be less than 128 characters.'),
}),
    signUp: userSchema.pick({ firstName: true, lastName: true }).extend({
  email: emailSchema,
  password: passwordSchema,
}),
    update: userSchema
  .pick({ firstName: true, lastName: true })
  .extend({
    password: z.union([passwordSchema, z.literal('')]),
    avatar: z.union([z.any(), z.literal('')]).nullable(),
  })
  .partial(),
    verifyEmail: z.object({
  token: z.string().min(1, 'Token is required'),
}),
    verifyEmailToken: z.object({
  token: z.string().min(1, 'Token is required'),
}),
    verifyResetToken: z.object({
  token: z.string().min(1, 'Token is required'),
}),
  },
  users: {
    list: paginationSchema.extend({
  filter: z
    .object({
      createdOn: z
        .object({
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
        })
        .optional(),
    })
    .optional(),
  sort: z
    .object({
      firstName: z.enum(['asc', 'desc']).optional(),
      lastName: z.enum(['asc', 'desc']).optional(),
      createdOn: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({ createdOn: 'asc' }),
}),
    update: userSchema.pick({ firstName: true, lastName: true, email: true }),
  },
} as const;

export type UsersRemovePathParams = { id: string };
export type UsersUpdatePathParams = { id: string };

export type AccountForgotPasswordParams = z.infer<typeof schemas.account.forgotPassword>;
export type AccountGoogleMobileParams = z.infer<typeof schemas.account.googleMobile>;
export type AccountResendEmailParams = z.infer<typeof schemas.account.resendEmail>;
export type AccountResetPasswordParams = z.infer<typeof schemas.account.resetPassword>;
export type AccountSignInParams = z.infer<typeof schemas.account.signIn>;
export type AccountSignUpParams = z.infer<typeof schemas.account.signUp>;
export type AccountUpdateParams = z.infer<typeof schemas.account.update>;
export type AccountVerifyEmailParams = z.infer<typeof schemas.account.verifyEmail>;
export type AccountVerifyEmailTokenParams = z.infer<typeof schemas.account.verifyEmailToken>;
export type AccountVerifyResetTokenParams = z.infer<typeof schemas.account.verifyResetToken>;
export type UsersListParams = z.infer<typeof schemas.users.list>;
export type UsersUpdateParams = z.infer<typeof schemas.users.update>;

export type AccountGetResponse = { _id: string; createdOn?: string; updatedOn?: string; deletedOn?: null | string; firstName: string; lastName: string; email: string; isEmailVerified: boolean; avatarUrl?: null | string; oauth?: { google?: { userId: string; connectedOn: string } }; lastRequest?: string };
export type AccountGoogleMobileResponse = { accessToken: string; user: { _id: string; createdOn?: string; updatedOn?: string; deletedOn?: null | string; firstName: string; lastName: string; email: string; isEmailVerified: boolean; avatarUrl?: null | string; oauth?: { google?: { userId: string; connectedOn: string } }; lastRequest?: string } };
export type AccountSignInResponse = { _id: string; createdOn?: string; updatedOn?: string; deletedOn?: null | string; firstName: string; lastName: string; email: string; isEmailVerified: boolean; avatarUrl?: null | string; oauth?: { google?: { userId: string; connectedOn: string } }; lastRequest?: string };
export type AccountSignUpResponse = { emailVerificationToken: string };
export type AccountUpdateResponse = null | { _id: string; createdOn?: string; updatedOn?: string; deletedOn?: null | string; firstName: string; lastName: string; email: string; isEmailVerified: boolean; avatarUrl?: null | string; oauth?: { google?: { userId: string; connectedOn: string } }; lastRequest?: string };
export type AccountVerifyEmailTokenResponse = { accessToken: string; user: { _id: string; createdOn?: string; updatedOn?: string; deletedOn?: null | string; firstName: string; lastName: string; email: string; isEmailVerified: boolean; avatarUrl?: null | string; oauth?: { google?: { userId: string; connectedOn: string } }; lastRequest?: string } };
export type UsersListResponse = { results: ({ _id: string; createdOn?: string; updatedOn?: string; deletedOn?: null | string; firstName: string; lastName: string; email: string; isEmailVerified: boolean; avatarUrl?: null | string; oauth?: { google?: { userId: unknown; connectedOn: unknown } }; lastRequest?: string })[]; pagesCount: number; count: number };
export type UsersUpdateResponse = null | { _id: string; createdOn?: string; updatedOn?: string; deletedOn?: null | string; firstName: string; lastName: string; email: string; isEmailVerified: boolean; avatarUrl?: null | string; oauth?: { google?: { userId: string; connectedOn: string } }; lastRequest?: string };

function createAccountEndpoints(client: ApiClient) {
  return {
    forgotPassword: {
      method: 'post' as const,
      path: '/account/forgot-password' as const,
      schema: schemas.account.forgotPassword,
      call: (params: AccountForgotPasswordParams, options?: { headers?: Record<string, string> }) =>
        client.post<void>('/account/forgot-password', params, options?.headers ? { headers: options.headers } : undefined),
    },
    get: {
      method: 'get' as const,
      path: '/account' as const,
      schema: undefined,
      call: (params?: Record<string, unknown>, options?: { headers?: Record<string, string> }) =>
        client.get<AccountGetResponse>('/account', params, options?.headers ? { headers: options.headers } : undefined),
    },
    google: {
      method: 'get' as const,
      path: '/account/sign-in/google' as const,
      schema: undefined,
      call: (params?: Record<string, unknown>, options?: { headers?: Record<string, string> }) =>
        client.get<void>('/account/sign-in/google', params, options?.headers ? { headers: options.headers } : undefined),
    },
    googleCallback: {
      method: 'get' as const,
      path: '/account/sign-in/google/callback' as const,
      schema: undefined,
      call: (params?: Record<string, unknown>, options?: { headers?: Record<string, string> }) =>
        client.get<void>('/account/sign-in/google/callback', params, options?.headers ? { headers: options.headers } : undefined),
    },
    googleMobile: {
      method: 'post' as const,
      path: '/account/sign-in/google/token' as const,
      schema: schemas.account.googleMobile,
      call: (params: AccountGoogleMobileParams, options?: { headers?: Record<string, string> }) =>
        client.post<AccountGoogleMobileResponse>('/account/sign-in/google/token', params, options?.headers ? { headers: options.headers } : undefined),
    },
    resendEmail: {
      method: 'post' as const,
      path: '/account/resend-email' as const,
      schema: schemas.account.resendEmail,
      call: (params: AccountResendEmailParams, options?: { headers?: Record<string, string> }) =>
        client.post<void>('/account/resend-email', params, options?.headers ? { headers: options.headers } : undefined),
    },
    resetPassword: {
      method: 'put' as const,
      path: '/account/reset-password' as const,
      schema: schemas.account.resetPassword,
      call: (params: AccountResetPasswordParams, options?: { headers?: Record<string, string> }) =>
        client.put<void>('/account/reset-password', params, options?.headers ? { headers: options.headers } : undefined),
    },
    signIn: {
      method: 'post' as const,
      path: '/account/sign-in' as const,
      schema: schemas.account.signIn,
      call: (params: AccountSignInParams, options?: { headers?: Record<string, string> }) =>
        client.post<AccountSignInResponse>('/account/sign-in', params, options?.headers ? { headers: options.headers } : undefined),
    },
    signOut: {
      method: 'post' as const,
      path: '/account/sign-out' as const,
      schema: undefined,
      call: (params?: Record<string, unknown>, options?: { headers?: Record<string, string> }) =>
        client.post<void>('/account/sign-out', params, options?.headers ? { headers: options.headers } : undefined),
    },
    signUp: {
      method: 'post' as const,
      path: '/account/sign-up' as const,
      schema: schemas.account.signUp,
      call: (params: AccountSignUpParams, options?: { headers?: Record<string, string> }) =>
        client.post<AccountSignUpResponse>('/account/sign-up', params, options?.headers ? { headers: options.headers } : undefined),
    },
    update: {
      method: 'put' as const,
      path: '/account' as const,
      schema: schemas.account.update,
      call: (params: AccountUpdateParams, options?: { headers?: Record<string, string> }) =>
        client.put<AccountUpdateResponse>('/account', params, options?.headers ? { headers: options.headers } : undefined),
    },
    verifyEmail: {
      method: 'get' as const,
      path: '/account/verify-email' as const,
      schema: schemas.account.verifyEmail,
      call: (params: AccountVerifyEmailParams, options?: { headers?: Record<string, string> }) =>
        client.get<void>('/account/verify-email', params, options?.headers ? { headers: options.headers } : undefined),
    },
    verifyEmailToken: {
      method: 'post' as const,
      path: '/account/verify-email/token' as const,
      schema: schemas.account.verifyEmailToken,
      call: (params: AccountVerifyEmailTokenParams, options?: { headers?: Record<string, string> }) =>
        client.post<AccountVerifyEmailTokenResponse>('/account/verify-email/token', params, options?.headers ? { headers: options.headers } : undefined),
    },
    verifyResetToken: {
      method: 'get' as const,
      path: '/account/verify-reset-token' as const,
      schema: schemas.account.verifyResetToken,
      call: (params: AccountVerifyResetTokenParams, options?: { headers?: Record<string, string> }) =>
        client.get<void>('/account/verify-reset-token', params, options?.headers ? { headers: options.headers } : undefined),
    },
  };
}

function createUsersEndpoints(client: ApiClient) {
  return {
    list: {
      method: 'get' as const,
      path: '/users' as const,
      schema: schemas.users.list,
      call: (params: UsersListParams, options?: { headers?: Record<string, string> }) =>
        client.get<UsersListResponse>('/users', params, options?.headers ? { headers: options.headers } : undefined),
    },
    remove: {
      method: 'delete' as const,
      path: '/users/:id' as const,
      schema: undefined,
      call: (params: Record<string, unknown> | undefined, options: { pathParams: UsersRemovePathParams; headers?: Record<string, string> }) =>
        client.delete<void>(`/users/${options.pathParams.id}`, params, options.headers ? { headers: options.headers } : undefined),
    },
    update: {
      method: 'put' as const,
      path: '/users/:id' as const,
      schema: schemas.users.update,
      call: (params: UsersUpdateParams, options: { pathParams: UsersUpdatePathParams; headers?: Record<string, string> }) =>
        client.put<UsersUpdateResponse>(`/users/${options.pathParams.id}`, params, options.headers ? { headers: options.headers } : undefined),
    },
  };
}

export function createApiEndpoints(client: ApiClient) {
  return {
    account: createAccountEndpoints(client),
    users: createUsersEndpoints(client),
  };
}

export type ApiEndpoints = ReturnType<typeof createApiEndpoints>;

export interface ApiEndpoint<TParams = unknown, TPathParams = never, TResponse = unknown> {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  schema: z.ZodType | undefined;
  call: TPathParams extends never
    ? (params: TParams, options?: { headers?: Record<string, string> }) => Promise<TResponse>
    : (params: TParams, options: { pathParams: TPathParams; headers?: Record<string, string> }) => Promise<TResponse>;
}

export type InferParams<T> = T extends { schema: infer S } ? (S extends z.ZodType ? z.infer<S> : Record<string, unknown>) : Record<string, unknown>;

export type InferPathParams<T> = T extends { call: (params: unknown, options: { pathParams: infer PP }) => unknown } ? PP : never;

export type InferResponse<T> = T extends { call: (...args: never[]) => Promise<infer R> } ? R : unknown;
