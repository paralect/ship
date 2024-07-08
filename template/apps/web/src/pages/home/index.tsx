import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { ColumnDef, SortDirection } from '@tanstack/react-table';
import { pick } from 'lodash';

import { userApi, UsersListParams, UsersListSortParams } from 'resources/user';

import { Table } from 'components';

import { User } from 'types';

import Filters from './components/Filters';

const DEFAULT_PAGE = 1;
const PER_PAGE = 10;
const EXTERNAL_SORT_FIELDS: Array<keyof UsersListSortParams> = ['createdOn'];

const DEFAULT_PARAMS: UsersListParams = {
  page: DEFAULT_PAGE,
  searchValue: '',
  perPage: PER_PAGE,
  sort: {
    createdOn: 'desc',
  },
};

const COLUMNS: ColumnDef<User>[] = [
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

const Home: NextPage = () => {
  const [params, setParams] = useSetState<UsersListParams>(DEFAULT_PARAMS);

  const { data: users, isLoading: isUserLostLoading } = userApi.useList(params);

  const onSortingChange = (sort: Record<string, SortDirection>) => {
    setParams((prev) => {
      const combinedSort = { ...pick(prev.sort, EXTERNAL_SORT_FIELDS), ...sort };

      return { sort: combinedSort };
    });
  };

  const onRowClick = (user: User) => {
    showNotification({
      title: 'Success',
      message: `You clicked on the row for the user with the email address ${user.email}.`,
      color: 'green',
    });
  };

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <Stack gap="lg">
        <Title order={2}>Users</Title>

        <Filters setParams={setParams} />

        <Table<User>
          data={users?.results}
          totalCount={users?.count}
          pageCount={users?.pagesCount}
          page={DEFAULT_PAGE}
          perPage={PER_PAGE}
          columns={COLUMNS}
          isLoading={isUserLostLoading}
          onPageChange={(page) => setParams({ page })}
          onSortingChange={onSortingChange}
          onRowClick={onRowClick}
        />
      </Stack>
    </>
  );
};

export default Home;
