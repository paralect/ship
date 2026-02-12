import { useCallback, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { SortDirection } from '@tanstack/react-table';
import { pick } from 'lodash';
import { toast } from 'sonner';

import { userApi, UserListParams } from 'resources/user';

import { Table } from 'components';

import { User } from 'types';

import Filters from './components/Filters';
import { COLUMNS, DEFAULT_PAGE, DEFAULT_PARAMS, EXTERNAL_SORT_FIELDS, PER_PAGE } from './constants';

const Home: NextPage = () => {
  const [params, setParamsState] = useState<UserListParams>(DEFAULT_PARAMS);
  const setParams = useCallback(
    (value: Partial<UserListParams> | ((prev: UserListParams) => Partial<UserListParams>)) => {
      setParamsState((prev) => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        return { ...prev, ...newValue };
      });
    },
    [],
  );

  const { data: users, isLoading: isUserListLoading } = userApi.useList(params);

  const onSortingChange = (sort: Record<string, SortDirection>) => {
    setParams((prev) => {
      const combinedSort = { ...pick(prev.sort, EXTERNAL_SORT_FIELDS), ...sort };
      return { sort: combinedSort };
    });
  };

  const onRowClick = (user: User) => {
    toast.success('Success', {
      description: `You clicked on the row for the user with the email address ${user.email}.`,
    });
  };

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <div className="flex flex-col gap-6 p-6">
        <h2 className="text-2xl font-semibold">Users</h2>

        <Filters setParams={setParams} />

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
    </>
  );
};

export default Home;
