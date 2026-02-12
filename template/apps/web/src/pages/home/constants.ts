import { ColumnDef } from '@tanstack/react-table';
import { UsersListParams } from 'shared';

import { User } from 'types';

export const DEFAULT_PAGE = 1;
export const PER_PAGE = 10;

type UserListSortFields = 'createdOn' | 'firstName' | 'lastName';
export const EXTERNAL_SORT_FIELDS: Array<UserListSortFields> = ['createdOn'];

export const DEFAULT_PARAMS: UsersListParams = {
  page: DEFAULT_PAGE,
  searchValue: '',
  perPage: PER_PAGE,
  sort: {
    createdOn: 'desc',
  },
};

export const COLUMNS: ColumnDef<User>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    enableSorting: true,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];
