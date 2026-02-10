import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { apiService } from 'services';

import { ListParams, ListResult, User } from 'types';

export interface UserListFilterParams {
  createdOn?: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export type UserListSortFields = 'createdOn' | 'firstName' | 'lastName';

export type UserListParams = ListParams<UserListFilterParams, Pick<User, UserListSortFields>>;
export type UserListResponse = ListResult<User>;

export const useList = <T extends UserListParams>(params: T, options?: Partial<UseQueryOptions<UserListResponse>>) =>
  useQuery<UserListResponse>({
    queryKey: ['users', params],
    queryFn: () => apiService.get('/users', params),
    ...options,
  });
