import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { SortDirection } from '@tanstack/react-table';
import { pick } from 'lodash';

import { userApi, UsersListParams } from 'resources/user';

import { Table } from 'components';

import { User } from 'types';

import Filters from './components/Filters';
import { COLUMNS, DEFAULT_PAGE, DEFAULT_PARAMS, EXTERNAL_SORT_FIELDS, PER_PAGE } from './constants';

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
