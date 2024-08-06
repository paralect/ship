import { ColumnDef } from '@tanstack/react-table';

import { UsersListParams, UsersListSortParams } from 'resources/user';

import { User } from 'types';

export const DEFAULT_PAGE = 1;
export const PER_PAGE = 10;
export const EXTERNAL_SORT_FIELDS: Array<keyof UsersListSortParams> = ['createdOn'];

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
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
];
