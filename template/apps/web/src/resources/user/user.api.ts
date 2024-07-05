import { DateValue } from '@mantine/dates';
import { useQuery } from '@tanstack/react-query';

import { apiService } from 'services';

import { ListParams, ListResult, SortOrder, User } from 'types';

export type UsersListFilterParams = {
  createdOn?: {
    startDate: DateValue;
    endDate: DateValue;
  };
};

export type UsersListSortParams = {
  createdOn?: SortOrder;
  firstName?: SortOrder;
  lastName?: SortOrder;
};

export type UsersListParams = ListParams<UsersListFilterParams, UsersListSortParams>;

export const useList = <T extends UsersListParams>(params: T) =>
  useQuery<ListResult<User>>({
    queryKey: ['users', params],
    queryFn: () => apiService.get('/users', params),
  });
