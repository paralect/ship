import { DateValue } from '@mantine/dates';

import { ListParams, ListResult, User } from 'types';

export interface UserListFilterParams {
  createdOn?: {
    startDate: DateValue;
    endDate: DateValue;
  };
}

export type UserListSortFields = 'createdOn' | 'firstName' | 'lastName';

export type UserListParams = ListParams<UserListFilterParams, Pick<User, UserListSortFields>>;
export type UserListResponse = ListResult<User>;
