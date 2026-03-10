import { useCallback, useState } from 'react';
import Head from 'next/head';
import { SortDirection } from '@tanstack/react-table';
import { useApiQuery } from 'hooks';
import { pick } from 'lodash';
import { UsersListParams, UsersListResponse } from 'shared';
import { toast } from 'sonner';

import { LayoutType, Page, ScopeType, Table } from 'components';

import { apiClient } from 'services';

import Filters from './components/Filters';
import { COLUMNS, DEFAULT_PAGE, DEFAULT_PARAMS, EXTERNAL_SORT_FIELDS, PER_PAGE } from './constants';

const Admin = () => {
  const [params, setParamsState] = useState<UsersListParams>(DEFAULT_PARAMS);
  const setParams = useCallback(
    (value: Partial<UsersListParams> | ((prev: UsersListParams) => Partial<UsersListParams>)) => {
      setParamsState((prev) => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        return { ...prev, ...newValue };
      });
    },
    [],
  );

  const { data: users, isLoading: isUserListLoading } = useApiQuery(apiClient.users.list, params);

  const onSortingChange = (sort: Record<string, SortDirection>) => {
    setParams((prev) => {
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
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Admin</title>
      </Head>

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
    </Page>
  );
};

export default Admin;
