import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { SortDirection } from '@tanstack/react-table';
import { useApiQuery } from '@/hooks';
import { pick } from 'lodash';
import { toast } from 'sonner';

import { Table } from '@/components';
import { apiClient } from '@/services/api-client.service';

import Filters from './-components/admin/filters';
import type { UsersListParams, UsersListResponse } from './-components/admin/constants';
import { COLUMNS, DEFAULT_PAGE, DEFAULT_PARAMS, EXTERNAL_SORT_FIELDS, PER_PAGE } from './-components/admin/constants';

export const Route = createFileRoute('/_authenticated/app/admin')({
  component: Admin,
});

function Admin() {
  const [params, setParamsState] = useState<UsersListParams>(DEFAULT_PARAMS);
  const setParams = useCallback(
    (value: Partial<UsersListParams> | ((prev: UsersListParams) => Partial<UsersListParams>)) => {
      setParamsState((prev: UsersListParams) => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        return { ...prev, ...newValue };
      });
    },
    [],
  );

  const { data: users, isLoading: isUserListLoading } = useApiQuery(apiClient.users.list, params);

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
