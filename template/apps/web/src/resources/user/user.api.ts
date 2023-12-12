import { useQuery } from '@tanstack/react-query';

import { User } from 'types';

import { apiService } from 'services';

export function useList<T>(params: T) {
  interface UserListResponse {
    count: number;
    items: User[];
    totalPages: number;
  }

  return useQuery<UserListResponse>({
    queryKey: ['users', params],
    queryFn: () => apiService.get('/users', params),
  });
}
