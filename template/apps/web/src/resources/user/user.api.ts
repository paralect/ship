import { useQuery } from '@tanstack/react-query';

import { ListResult, User } from 'types';

import { apiService } from 'services';

export const useList = <T>(params: T) => useQuery<ListResult<User>>({
  queryKey: ['users', params],
  queryFn: () => apiService.get('/users', params),
});
