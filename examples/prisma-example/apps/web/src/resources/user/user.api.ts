import { DateValue } from '@mantine/dates';
import { useQuery } from '@tanstack/react-query';
import { User } from 'database'

import { apiService } from 'services';

import { ListParams, ListResult, SortOrder } from 'types';

export type UsersListFilterParams = {
  createdAt?: {
    startDate: DateValue;
    endDate: DateValue;
  };
};

export type UsersListSortParams = {
  createdAt?: SortOrder;
  firstName?: SortOrder;
  lastName?: SortOrder;
};

export type UsersListParams = ListParams<UsersListFilterParams, UsersListSortParams>;

export const useList = <T extends UsersListParams>(params: T) =>
  useQuery<ListResult<User>>({
    queryKey: ['users', params],
    queryFn: () => apiService.get('/users', params),
  });
