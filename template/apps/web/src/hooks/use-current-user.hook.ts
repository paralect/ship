import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { apiClient } from 'services/api-client.service';

import type { User } from 'types';

import { queryKey } from './use-api.hook';

type UseCurrentUserOptions = Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>;

export function useCurrentUser(options?: UseCurrentUserOptions) {
  return useQuery<User>({
    queryKey: queryKey(apiClient.users.getCurrent),
    queryFn: () => apiClient.users.getCurrent(),
    staleTime: Number.POSITIVE_INFINITY,
    ...options,
  });
}
