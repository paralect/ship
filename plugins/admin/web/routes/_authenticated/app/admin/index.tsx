import { useCallback, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { SortDirection } from '@tanstack/react-table';
import { Users } from 'lucide-react';
import { pick } from 'lodash';
import { toast } from 'sonner';

import { Table } from '@/components';
import { useApiQuery } from '@/hooks';
import { apiClient } from '@/services/api-client.service';

import type { UsersListParams, UsersListResponse } from './-components/constants';
import {
  COLUMNS,
  DEFAULT_PAGE,
  DEFAULT_PARAMS,
  EXTERNAL_SORT_FIELDS,
  PER_PAGE,
} from './-components/constants';
import Filters from './-components/filters';

export const Route = createFileRoute('/_authenticated/app/admin/')({
  staticData: { nav: { label: 'Admin', icon: Users, order: 30 } },
  component: Admin,
});

function Admin() {
  const [params, setParamsState] = useState<UsersListParams>(DEFAULT_PARAMS);
  const setParams = useCallback(
    (
      value:
        | Partial<UsersListParams>
        | ((prev: UsersListParams) => Partial<UsersListParams>),
    ) => {
      setParamsState((prev: UsersListParams) => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        return { ...prev, ...newValue };
      });
    },
    [],
  );

  const { data: users, isLoading: isUserListLoading } = useApiQuery(
    apiClient.users.list,
    params,
  );

  const onSortingChange = (sort: Record<string, SortDirection>) => {
    setParams((prev: UsersListParams) => {
      const combinedSort = { ...pick(prev.sort, EXTERNAL_SORT_FIELDS), ...sort };
      return { sort: combinedSort };
    });
  };

  type User = UsersListResponse['results'][number];

  const onRowClick = (user: User) => {
    toast.success('Success', {
      description: `You clicked on the row for the user with the email address ${user.email}.`,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <h2 className="text-xl font-semibold sm:text-2xl">Users</h2>

      <Filters setParams={setParams} />

      <div className="overflow-x-auto">
        <Table<User>
          data={users?.results}
          totalCount={users?.count}
          pageCount={users?.pagesCount}
          page={DEFAULT_PAGE}
          perPage={PER_PAGE}
          columns={COLUMNS}
          isLoading={isUserListLoading}
          onPageChange={(page) => setParams({ page })}
          onSortingChange={onSortingChange}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
}
