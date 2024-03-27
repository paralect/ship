import { useQuery } from '@tanstack/react-query';

import { apiService } from 'services';

import { ListResult, User } from 'types';

export const useList = <T>(params: T) =>
  useQuery<ListResult<User>>({
    queryKey: ['users', params],
    queryFn: () => apiService.get('/users', params),
  });
