import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { z, ZodType } from 'zod';

import { ApiError } from 'shared';

type InferParams<T> = T extends { schema: ZodType<infer P> } ? P : Record<string, never>;
type InferPathParams<T> = T extends { call: (params: infer _P, options: infer O) => unknown }
  ? O extends { pathParams: infer PP }
    ? PP
    : undefined
  : undefined;
type InferResponse<T> = T extends { call: (...args: never[]) => Promise<infer R> }
  ? R
  : unknown;

type RequestOptions<TPathParams> = TPathParams extends undefined
  ? { pathParams?: never; headers?: Record<string, string> }
  : { pathParams: TPathParams; headers?: Record<string, string> };

type UseApiQueryOptions<TResponse> = Omit<UseQueryOptions<TResponse>, 'queryKey' | 'queryFn'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiEndpoint = {
  schema: ZodType | undefined;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call: (...args: any[]) => Promise<any>;
};

export function useApiQuery<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  params?: InferParams<TEndpoint>,
  options?: RequestOptions<InferPathParams<TEndpoint>> & UseApiQueryOptions<InferResponse<TEndpoint>>,
): ReturnType<typeof useQuery<InferResponse<TEndpoint>>> {
  const { pathParams, headers, ...queryOptions } = (options ?? {}) as { pathParams?: unknown; headers?: Record<string, string> } &
    UseApiQueryOptions<InferResponse<TEndpoint>>;

  const queryKey = [endpoint.path, params, pathParams].filter((v) => v !== undefined && v !== null);

  const callOptions = pathParams || headers ? { pathParams, headers } : undefined;

  return useQuery({
    queryKey,
    queryFn: () => (callOptions ? endpoint.call(params ?? {}, callOptions) : endpoint.call(params ?? {})),
    ...queryOptions,
  }) as ReturnType<typeof useQuery<InferResponse<TEndpoint>>>;
}

type UseApiMutationOptions<TResponse, TParams> = Omit<UseMutationOptions<TResponse, ApiError, TParams>, 'mutationFn'>;

export function useApiMutation<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options?: RequestOptions<InferPathParams<TEndpoint>> &
    UseApiMutationOptions<InferResponse<TEndpoint>, InferParams<TEndpoint>>,
): ReturnType<typeof useMutation<InferResponse<TEndpoint>, ApiError, InferParams<TEndpoint>>> {
  const { pathParams, headers, ...mutationOptions } = (options ?? {}) as { pathParams?: unknown; headers?: Record<string, string> } &
    UseApiMutationOptions<InferResponse<TEndpoint>, InferParams<TEndpoint>>;

  const callOptions = pathParams || headers ? { pathParams, headers } : undefined;

  return useMutation({
    mutationFn: (params: InferParams<TEndpoint>) =>
      (callOptions ? endpoint.call(params, callOptions) : endpoint.call(params)) as Promise<InferResponse<TEndpoint>>,
    ...mutationOptions,
  }) as ReturnType<typeof useMutation<InferResponse<TEndpoint>, ApiError, InferParams<TEndpoint>>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormEndpoint = {
  schema: ZodType<Record<string, unknown>>;
  path: string;
};

type UseApiFormOptions<TParams extends Record<string, unknown>> = Omit<UseFormProps<TParams>, 'resolver'>;

export function useApiForm<TEndpoint extends FormEndpoint>(
  endpoint: TEndpoint,
  options?: UseApiFormOptions<z.infer<TEndpoint['schema']>>,
): UseFormReturn<z.infer<TEndpoint['schema']>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useForm({
    resolver: zodResolver(endpoint.schema as any),
    ...options,
  }) as UseFormReturn<z.infer<TEndpoint['schema']>>;
}

export { useApiQuery as default };
