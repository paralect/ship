import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { apiClient } from 'services/api-client.service';
import * as socketService from 'services/socket.service';

import queryClient from 'query-client';

import type { User } from 'types';

import { queryKey } from './use-api.hook';

type UseCurrentUserOptions = Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>;

export const currentUserKey = queryKey(apiClient.users.getCurrent);

socketService.on('user:updated', (user: User) => {
  queryClient.setQueryData<User>(currentUserKey, user);
});

export function useCurrentUser(options?: UseCurrentUserOptions) {
  return useQuery<User>({
    queryKey: currentUserKey,
    queryFn: () => apiClient.users.getCurrent(),
    staleTime: Number.POSITIVE_INFINITY,
    ...options,
  });
}
