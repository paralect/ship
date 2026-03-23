import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { UseFormProps, UseFormReturn } from 'react-hook-form';
import { z, ZodType } from 'zod';
import type { Client } from '@orpc/client';

import { ORPC_PATH } from 'services/api-client.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = Client<any, any, any, any>;

type InferInput<T> = T extends Client<any, infer I, any, any> ? I : void;
type InferOutput<T> = T extends Client<any, any, infer O, any> ? O : unknown;


function getProcedureKey(procedure: AnyClient): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const key = (procedure as any)[ORPC_PATH] as string[] | undefined;
  if (!key) throw new Error('Unknown procedure — not found in orpc client');
  return key;
}


export function queryKey(procedure: AnyClient, input?: unknown): unknown[] {
  const key = getProcedureKey(procedure);
  return input !== undefined && input !== null ? [...key, input] : key;
}

type UseApiQueryOptions<TResponse> = Omit<UseQueryOptions<TResponse>, 'queryKey' | 'queryFn'>;

type InputIsOptional<T> = InferInput<T> extends void ? true : unknown extends InferInput<T> ? true : false;

export function useApiQuery<T extends AnyClient>(
  procedure: T,
  ...rest: InputIsOptional<T> extends true
    ? [options?: UseApiQueryOptions<InferOutput<T>>]
    : [input: InferInput<T>, options?: UseApiQueryOptions<InferOutput<T>>]
) {
  let input: unknown;
  let options: UseApiQueryOptions<InferOutput<T>> | undefined;

  if (rest.length === 2) {
    input = rest[0];
    options = rest[1] as UseApiQueryOptions<InferOutput<T>>;
  } else if (rest.length === 1) {
    const arg = rest[0];
    if (arg && typeof arg === 'object' && ('enabled' in (arg as Record<string, unknown>) || 'staleTime' in (arg as Record<string, unknown>) || 'refetchOnWindowFocus' in (arg as Record<string, unknown>))) {
      options = arg as UseApiQueryOptions<InferOutput<T>>;
    } else {
      input = arg;
    }
  }

  const key = queryKey(procedure, input);

  return useQuery<InferOutput<T>>({
    queryKey: key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => (procedure as any)(input) as Promise<InferOutput<T>>,
    ...options,
  });
}

export interface ORPCError extends Error {
  data?: unknown;
  status?: number;
}

type UseApiMutationOptions<TResponse, TParams> = Omit<
  UseMutationOptions<TResponse, ORPCError, TParams>,
  'mutationFn'
>;

export function useApiMutation<T extends AnyClient>(
  procedure: T,
  options?: UseApiMutationOptions<InferOutput<T>, InferInput<T>>,
) {
  return useMutation<InferOutput<T>, ORPCError, InferInput<T>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (input: InferInput<T>) => (procedure as any)(input) as Promise<InferOutput<T>>,
    ...options,
  });
}

type UseApiFormOptions<TParams extends Record<string, unknown>> = Omit<UseFormProps<TParams>, 'resolver'>;

export function useApiForm<TSchema extends ZodType<Record<string, unknown>>>(
  schema: TSchema,
  options?: UseApiFormOptions<z.infer<TSchema>>,
): UseFormReturn<z.infer<TSchema>> {
  return useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    ...options,
  }) as UseFormReturn<z.infer<TSchema>>;
}

export { useApiQuery as default };
