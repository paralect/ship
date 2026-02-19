import { z } from "zod";

import { ApiClient } from "../client";
import {
  chatSchema,
  emailSchema,
  listResultSchema,
  messageSchema,
  paginationSchema,
  passwordSchema,
  userPublicSchema,
  userSchema,
} from "../schemas";

export const schemas = {
  account: {
    forgotPassword: z.object({
      email: emailSchema,
    }),
    resendEmail: z.object({
      email: emailSchema,
    }),
    resetPassword: z.object({
      token: z.string().min(1, "Token is required"),
      password: passwordSchema,
    }),
    signIn: z.object({
      email: emailSchema,
      password: z
        .string()
        .min(1, "Password is required")
        .max(128, "Password must be less than 128 characters."),
    }),
    signUp: userSchema.pick({ firstName: true, lastName: true }).extend({
      email: emailSchema,
      password: passwordSchema,
    }),
    update: userSchema
      .pick({ firstName: true, lastName: true })
      .extend({
        password: z.union([passwordSchema, z.literal("")]),
        avatar: z.union([z.any(), z.literal("")]).nullable(),
      })
      .partial(),
    verifyEmail: z.object({
      token: z.string().min(1, "Token is required"),
    }),
    verifyResetToken: z.object({
      token: z.string().min(1, "Token is required"),
    }),
  },
  chats: {
    create: z.object({
      title: z.string().min(1).max(255).optional(),
    }),
    delete: z.object({}),
    getMessages: z.object({}),
    list: z.object({}),
    sendMessage: z.object({
      content: z.string().min(1),
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
          firstName: z.enum(["asc", "desc"]).optional(),
          lastName: z.enum(["asc", "desc"]).optional(),
          createdOn: z.enum(["asc", "desc"]).default("asc"),
        })
        .default({ createdOn: "asc" }),
    }),
    update: userSchema.pick({ firstName: true, lastName: true, email: true }),
  },
} as const;

export interface ChatsDeletePathParams {
  chatId: string;
}
export interface ChatsGetMessagesPathParams {
  chatId: string;
}
export interface ChatsSendMessagePathParams {
  chatId: string;
}
export interface UsersRemovePathParams {
  id: string;
}
export interface UsersUpdatePathParams {
  id: string;
}

export type AccountForgotPasswordParams = z.infer<
  typeof schemas.account.forgotPassword
>;
export type AccountResendEmailParams = z.infer<
  typeof schemas.account.resendEmail
>;
export type AccountResetPasswordParams = z.infer<
  typeof schemas.account.resetPassword
>;
export type AccountSignInParams = z.infer<typeof schemas.account.signIn>;
export type AccountSignUpParams = z.infer<typeof schemas.account.signUp>;
export type AccountUpdateParams = z.infer<typeof schemas.account.update>;
export type AccountVerifyEmailParams = z.infer<
  typeof schemas.account.verifyEmail
>;
export type AccountVerifyResetTokenParams = z.infer<
  typeof schemas.account.verifyResetToken
>;
export type ChatsCreateParams = z.infer<typeof schemas.chats.create>;
export type ChatsDeleteParams = z.infer<typeof schemas.chats.delete>;
export type ChatsGetMessagesParams = z.infer<typeof schemas.chats.getMessages>;
export type ChatsListParams = z.infer<typeof schemas.chats.list>;
export type ChatsSendMessageParams = z.infer<typeof schemas.chats.sendMessage>;
export type UsersListParams = z.infer<typeof schemas.users.list>;
export type UsersUpdateParams = z.infer<typeof schemas.users.update>;

export type AccountGetResponse = z.infer<typeof userPublicSchema>;
export type AccountSignInResponse = z.infer<typeof userPublicSchema>;
export interface AccountSignUpResponse {
  emailVerificationToken: string;
}
export type AccountUpdateResponse = z.infer<typeof userPublicSchema>;
export type ChatsCreateResponse = z.infer<typeof chatSchema>;
export type ChatsGetMessagesResponse = z.infer<typeof messageSchema>[];
export type ChatsListResponse = z.infer<typeof chatSchema>[];
export type UsersListResponse = z.infer<
  ReturnType<typeof listResultSchema<typeof userPublicSchema>>
>;
export type UsersUpdateResponse = z.infer<typeof userPublicSchema>;

function createAccountEndpoints(client: ApiClient) {
  return {
    forgotPassword: {
      method: "post" as const,
      path: "/account/forgot-password" as const,
      schema: schemas.account.forgotPassword,
      call: (params: AccountForgotPasswordParams) =>
        client.post<void>("/account/forgot-password", params),
    },
    get: {
      method: "get" as const,
      path: "/account" as const,
      schema: undefined,
      call: (params?: Record<string, unknown>) =>
        client.get<AccountGetResponse>("/account", params),
    },
    google: {
      method: "get" as const,
      path: "/account/sign-in/google" as const,
      schema: undefined,
      call: (params?: Record<string, unknown>) =>
        client.get<void>("/account/sign-in/google", params),
    },
    googleCallback: {
      method: "get" as const,
      path: "/account/sign-in/google/callback" as const,
      schema: undefined,
      call: (params?: Record<string, unknown>) =>
        client.get<void>("/account/sign-in/google/callback", params),
    },
    resendEmail: {
      method: "post" as const,
      path: "/account/resend-email" as const,
      schema: schemas.account.resendEmail,
      call: (params: AccountResendEmailParams) =>
        client.post<void>("/account/resend-email", params),
    },
    resetPassword: {
      method: "put" as const,
      path: "/account/reset-password" as const,
      schema: schemas.account.resetPassword,
      call: (params: AccountResetPasswordParams) =>
        client.put<void>("/account/reset-password", params),
    },
    signIn: {
      method: "post" as const,
      path: "/account/sign-in" as const,
      schema: schemas.account.signIn,
      call: (params: AccountSignInParams) =>
        client.post<AccountSignInResponse>("/account/sign-in", params),
    },
    signOut: {
      method: "post" as const,
      path: "/account/sign-out" as const,
      schema: undefined,
      call: (params?: Record<string, unknown>) =>
        client.post<void>("/account/sign-out", params),
    },
    signUp: {
      method: "post" as const,
      path: "/account/sign-up" as const,
      schema: schemas.account.signUp,
      call: (params: AccountSignUpParams) =>
        client.post<AccountSignUpResponse>("/account/sign-up", params),
    },
    update: {
      method: "put" as const,
      path: "/account" as const,
      schema: schemas.account.update,
      call: (params: AccountUpdateParams) =>
        client.put<AccountUpdateResponse>("/account", params),
    },
    verifyEmail: {
      method: "get" as const,
      path: "/account/verify-email" as const,
      schema: schemas.account.verifyEmail,
      call: (params: AccountVerifyEmailParams) =>
        client.get<void>("/account/verify-email", params),
    },
    verifyResetToken: {
      method: "get" as const,
      path: "/account/verify-reset-token" as const,
      schema: schemas.account.verifyResetToken,
      call: (params: AccountVerifyResetTokenParams) =>
        client.get<void>("/account/verify-reset-token", params),
    },
  };
}

function createChatsEndpoints(client: ApiClient) {
  return {
    create: {
      method: "post" as const,
      path: "/chats" as const,
      schema: schemas.chats.create,
      call: (params: ChatsCreateParams) =>
        client.post<ChatsCreateResponse>("/chats", params),
    },
    delete: {
      method: "delete" as const,
      path: "/chats/:chatId" as const,
      schema: schemas.chats.delete,
      call: (
        params: ChatsDeleteParams,
        options: {
          pathParams: ChatsDeletePathParams;
          headers?: Record<string, string>;
        },
      ) =>
        client.delete<void>(
          `/chats/${options.pathParams.chatId}`,
          params,
          options.headers ? { headers: options.headers } : undefined,
        ),
    },
    getMessages: {
      method: "get" as const,
      path: "/chats/:chatId/messages" as const,
      schema: schemas.chats.getMessages,
      call: (
        params: ChatsGetMessagesParams,
        options: {
          pathParams: ChatsGetMessagesPathParams;
          headers?: Record<string, string>;
        },
      ) =>
        client.get<ChatsGetMessagesResponse>(
          `/chats/${options.pathParams.chatId}/messages`,
          params,
          options.headers ? { headers: options.headers } : undefined,
        ),
    },
    list: {
      method: "get" as const,
      path: "/chats" as const,
      schema: schemas.chats.list,
      call: (params: ChatsListParams) =>
        client.get<ChatsListResponse>("/chats", params),
    },
    sendMessage: {
      method: "post" as const,
      path: "/chats/:chatId/messages" as const,
      schema: schemas.chats.sendMessage,
      call: (
        params: ChatsSendMessageParams,
        options: {
          pathParams: ChatsSendMessagePathParams;
          headers?: Record<string, string>;
        },
      ) =>
        client.post<void>(
          `/chats/${options.pathParams.chatId}/messages`,
          params,
          options.headers ? { headers: options.headers } : undefined,
        ),
    },
  };
}

function createUsersEndpoints(client: ApiClient) {
  return {
    list: {
      method: "get" as const,
      path: "/users" as const,
      schema: schemas.users.list,
      call: (params: UsersListParams) =>
        client.get<UsersListResponse>("/users", params),
    },
    remove: {
      method: "delete" as const,
      path: "/users/:id" as const,
      schema: undefined,
      call: (
        params: Record<string, unknown> | undefined,
        options: {
          pathParams: UsersRemovePathParams;
          headers?: Record<string, string>;
        },
      ) =>
        client.delete<void>(
          `/users/${options.pathParams.id}`,
          params,
          options.headers ? { headers: options.headers } : undefined,
        ),
    },
    update: {
      method: "put" as const,
      path: "/users/:id" as const,
      schema: schemas.users.update,
      call: (
        params: UsersUpdateParams,
        options: {
          pathParams: UsersUpdatePathParams;
          headers?: Record<string, string>;
        },
      ) =>
        client.put<UsersUpdateResponse>(
          `/users/${options.pathParams.id}`,
          params,
          options.headers ? { headers: options.headers } : undefined,
        ),
    },
  };
}

export function createApiEndpoints(client: ApiClient) {
  return {
    account: createAccountEndpoints(client),
    chats: createChatsEndpoints(client),
    users: createUsersEndpoints(client),
  };
}

export type ApiEndpoints = ReturnType<typeof createApiEndpoints>;

export interface ApiEndpoint<
  TParams = unknown,
  TPathParams = never,
  TResponse = unknown,
> {
  method: "get" | "post" | "put" | "patch" | "delete";
  path: string;
  schema: z.ZodType | undefined;
  call: TPathParams extends never
    ? (params: TParams) => Promise<TResponse>
    : (
        params: TParams,
        options: { pathParams: TPathParams; headers?: Record<string, string> },
      ) => Promise<TResponse>;
}

export type InferParams<T> = T extends { schema: infer S }
  ? S extends z.ZodType
    ? z.infer<S>
    : Record<string, unknown>
  : Record<string, unknown>;

export type InferPathParams<T> = T extends {
  call: (params: unknown, options: { pathParams: infer PP }) => unknown;
}
  ? PP
  : never;

export type InferResponse<T> = T extends {
  call: (...args: never[]) => Promise<infer R>;
}
  ? R
  : unknown;
