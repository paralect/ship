import { useQuery } from 'react-query';

import { apiService } from 'services';

import { User } from './user.types';

export function useList<T>(params: T) {
  const list = () => apiService.get('/users', params);

  interface UserListResponse {
    count: number;
    items: User[];
    totalPages: number;
  }

  return useQuery<UserListResponse>(['users', params], list);
}
