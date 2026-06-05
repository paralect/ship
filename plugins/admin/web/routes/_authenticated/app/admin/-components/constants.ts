import type { InferClientInputs, InferClientOutputs } from '@orpc/client';
import { ColumnDef } from '@tanstack/react-table';

import type { orpc } from '@/services/api-client.service';

export const DEFAULT_PAGE = 1;

export type UsersListParams = InferClientInputs<typeof orpc>['users']['list'];
export type UsersListResponse = InferClientOutputs<typeof orpc>['users']['list'];
type User = UsersListResponse['results'][number];
export const PER_PAGE = 10;

type UserListSortFields = 'createdAt' | 'fullName';
export const EXTERNAL_SORT_FIELDS: Array<UserListSortFields> = ['createdAt'];

export const DEFAULT_PARAMS: UsersListParams = {
  page: DEFAULT_PAGE,
  searchValue: '',
  perPage: PER_PAGE,
  sort: {
    createdAt: 'desc',
  },
};

export const COLUMNS: ColumnDef<User>[] = [
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];
