import { useInfiniteQuery, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { apiService } from 'services';

import { ApiError, InfinityQueryOptions, ListResult, User } from 'types';

import { UserListParams, UserListResponse } from '.';

const BASE_URL = '/users';

export const useList = <T extends UserListParams>(params: T, options?: Partial<UseQueryOptions<UserListResponse>>) =>
  useQuery<UserListResponse>({
    queryKey: ['users', params],
    queryFn: () => apiService.get(BASE_URL, params),
    ...options,
  });

export const useInfinityList = <T extends UserListParams>(
  params: T,
  options?: InfinityQueryOptions<ListResult<User>, ApiError>,
) => {
  const queryFn = (pageParam: number): Promise<ListResult<User>> =>
    apiService.get(BASE_URL, { ...params, page: pageParam });

  return useInfiniteQuery<ListResult<User>, ApiError>({
    queryKey: ['users-infinity-list', params],
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam as number),
    getNextPageParam: (lastPage) => (lastPage.pagesCount > lastPage.page! ? lastPage.page! + 1 : undefined),
    initialPageParam: 1,
    ...(options || {}),
  });
};
