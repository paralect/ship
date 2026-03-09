import { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { ApiError } from 'shared';
import { z, ZodType } from 'zod';

import config from 'config';

type InferParams<T> = T extends { schema: ZodType<infer P> } ? P : Record<string, never>;
type InferPathParams<T> = T extends { call: (params: infer _P, options: infer O) => unknown }
  ? O extends { pathParams: infer PP }
    ? PP
    : undefined
  : undefined;
type InferResponse<T> = T extends { call: (...args: never[]) => Promise<infer R> } ? R : unknown;
type InferStreamResponse<T> = T extends { streamResponse: infer R } ? R : unknown;

type QueryRequestOptions<TPathParams> = TPathParams extends undefined
  ? { pathParams?: never; headers?: Record<string, string> }
  : { pathParams: TPathParams; headers?: Record<string, string> };

type MutationRequestOptions<TPathParams> = TPathParams extends undefined
  ? { pathParams?: never; headers?: Record<string, string> }
  : { pathParams?: TPathParams; headers?: Record<string, string> };

type UseApiQueryOptions<TResponse> = Omit<UseQueryOptions<TResponse>, 'queryKey' | 'queryFn'>;

interface ApiEndpoint {
  schema: ZodType | undefined;
  path: string;
  streamResponse?: unknown;
  // eslint-disable-next-line ts/no-explicit-any
  call: (...args: any[]) => Promise<any>;
}

type QueryOptions<TEndpoint extends ApiEndpoint> = QueryRequestOptions<InferPathParams<TEndpoint>> &
  UseApiQueryOptions<InferResponse<TEndpoint>>;

export function useApiQuery<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  paramsOrOptions?: InferParams<TEndpoint> | QueryOptions<TEndpoint>,
  options?: QueryOptions<TEndpoint>,
): ReturnType<typeof useQuery<InferResponse<TEndpoint>>> {
  let params: InferParams<TEndpoint> | undefined;
  let resolvedOptions: QueryOptions<TEndpoint> | undefined;

  if (options !== undefined) {
    params = paramsOrOptions as InferParams<TEndpoint>;
    resolvedOptions = options;
  } else if (paramsOrOptions != null && !endpoint.schema) {
    resolvedOptions = paramsOrOptions as QueryOptions<TEndpoint>;
  } else {
    params = paramsOrOptions as InferParams<TEndpoint>;
  }

  const { pathParams, headers, ...queryOptions } = (resolvedOptions ?? {}) as {
    pathParams?: unknown;
    headers?: Record<string, string>;
  } & UseApiQueryOptions<InferResponse<TEndpoint>>;

  const needsPathParams = endpoint.path.includes(':');
  const resolvedPathParams = needsPathParams ? (pathParams ?? params) : pathParams;

  const queryKey = [endpoint.path, params, resolvedPathParams].filter((v) => v !== undefined && v !== null);

  const callOptions = resolvedPathParams || headers ? { pathParams: resolvedPathParams, headers } : undefined;

  return useQuery({
    queryKey,
    queryFn: () => (callOptions ? endpoint.call(params ?? {}, callOptions) : endpoint.call(params ?? {})),
    ...queryOptions,
  }) as ReturnType<typeof useQuery<InferResponse<TEndpoint>>>;
}

type UseApiMutationOptions<TResponse, TParams> = Omit<UseMutationOptions<TResponse, ApiError, TParams>, 'mutationFn'>;

export function useApiMutation<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
  options?: MutationRequestOptions<InferPathParams<TEndpoint>> &
    UseApiMutationOptions<InferResponse<TEndpoint>, InferParams<TEndpoint>>,
): ReturnType<typeof useMutation<InferResponse<TEndpoint>, ApiError, InferParams<TEndpoint>>> {
  const { pathParams, headers, ...mutationOptions } = (options ?? {}) as {
    pathParams?: unknown;
    headers?: Record<string, string>;
  } & UseApiMutationOptions<InferResponse<TEndpoint>, InferParams<TEndpoint>>;

  const needsPathParams = endpoint.path.includes(':');

  return useMutation({
    mutationFn: (params: InferParams<TEndpoint>) => {
      const resolvedPathParams = needsPathParams ? (pathParams ?? params) : pathParams;
      const callOptions = resolvedPathParams || headers ? { pathParams: resolvedPathParams, headers } : undefined;
      return (callOptions ? endpoint.call(params, callOptions) : endpoint.call(params)) as Promise<
        InferResponse<TEndpoint>
      >;
    },
    ...mutationOptions,
  }) as ReturnType<typeof useMutation<InferResponse<TEndpoint>, ApiError, InferParams<TEndpoint>>>;
}

interface StreamCallbacks<TDoneData = unknown> {
  onToken?: (token: string) => void;
  onDone?: (data: TDoneData) => void;
  onError?: (error: string) => void;
}

type StreamMutateOptions<TPathParams, TDoneData> = StreamCallbacks<TDoneData> &
  (TPathParams extends undefined ? { pathParams?: never } : { pathParams: TPathParams });

interface UseApiStreamMutationReturn<TParams, TPathParams, TDoneData = unknown> {
  mutate: (params: TParams, options?: StreamMutateOptions<TPathParams, TDoneData>) => void;
  mutateAsync: (params: TParams, options?: StreamMutateOptions<TPathParams, TDoneData>) => Promise<void>;
  isLoading: boolean;
  reset: () => void;
}

export function useApiStreamMutation<TEndpoint extends ApiEndpoint>(
  endpoint: TEndpoint,
): UseApiStreamMutationReturn<InferParams<TEndpoint>, InferPathParams<TEndpoint>, InferStreamResponse<TEndpoint>> {
  const [isLoading, setIsLoading] = useState(false);

  const buildUrl = useCallback(
    (pathParams?: Record<string, string>) => {
      let url = `${config.API_URL}${endpoint.path}`;
      if (pathParams) {
        Object.entries(pathParams).forEach(([key, value]) => {
          url = url.replace(`:${key}`, value);
        });
      }
      return url;
    },
    [endpoint.path],
  );

  const executeStream = useCallback(
    async (
      params: InferParams<TEndpoint>,
      options?: StreamMutateOptions<InferPathParams<TEndpoint>, InferStreamResponse<TEndpoint>>,
    ) => {
      setIsLoading(true);

      const { pathParams, onToken, onDone, onError } = (options ?? {}) as StreamCallbacks<
        InferStreamResponse<TEndpoint>
      > & {
        pathParams?: Record<string, string>;
      };

      try {
        const response = await fetch(buildUrl(pathParams), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          onError?.(`HTTP error! status: ${response.status}`);
          setIsLoading(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          onError?.('No response body');
          setIsLoading(false);
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'text') {
                  onToken?.(data.content);
                } else if (data.type === 'done') {
                  onDone?.(data as InferStreamResponse<TEndpoint>);
                  setIsLoading(false);
                } else if (data.type === 'error') {
                  onError?.(data.message);
                  setIsLoading(false);
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      } catch (error) {
        const { onError } = (options ?? {}) as StreamCallbacks<InferStreamResponse<TEndpoint>>;
        onError?.(error instanceof Error ? error.message : 'Stream failed');
        setIsLoading(false);
      }
    },
    [buildUrl],
  );

  const mutate = useCallback(
    (
      params: InferParams<TEndpoint>,
      options?: StreamMutateOptions<InferPathParams<TEndpoint>, InferStreamResponse<TEndpoint>>,
    ) => {
      executeStream(params, options);
    },
    [executeStream],
  );

  const mutateAsync = useCallback(
    async (
      params: InferParams<TEndpoint>,
      options?: StreamMutateOptions<InferPathParams<TEndpoint>, InferStreamResponse<TEndpoint>>,
    ) => {
      await executeStream(params, options);
    },
    [executeStream],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
  }, []);

  return { mutate, mutateAsync, isLoading, reset };
}

interface FormEndpoint {
  schema: ZodType<Record<string, unknown>>;
  path: string;
}

type UseApiFormOptions<TParams extends Record<string, unknown>> = Omit<UseFormProps<TParams>, 'resolver'>;

export function useApiForm<TEndpoint extends FormEndpoint>(
  endpoint: TEndpoint,
  options?: UseApiFormOptions<z.infer<TEndpoint['schema']>>,
): UseFormReturn<z.infer<TEndpoint['schema']>> {
  return useForm({
    // eslint-disable-next-line ts/no-explicit-any
    resolver: zodResolver(endpoint.schema as any),
    ...options,
  }) as UseFormReturn<z.infer<TEndpoint['schema']>>;
}

export { useApiQuery as default };
