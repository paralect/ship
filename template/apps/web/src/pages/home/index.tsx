import { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { SortDirection } from '@tanstack/react-table';
import { useApiQuery } from 'hooks';
import { pick } from 'lodash';
import { UsersListParams, UsersListResponse } from 'shared';

import { Table } from 'components';

import { apiClient } from 'services';

import Filters from './components/Filters';
import { COLUMNS, DEFAULT_PAGE, DEFAULT_PARAMS, EXTERNAL_SORT_FIELDS, PER_PAGE } from './constants';

const Home: NextPage = () => {
  const [params, setParams] = useSetState(DEFAULT_PARAMS);
  const { data: users, isLoading: isUserListLoading } = useApiQuery(apiClient.users.list, params);

  const onSortingChange = (sort: Record<string, SortDirection>) => {
    setParams((prev: UsersListParams) => {
      const combinedSort = { ...pick(prev.sort, EXTERNAL_SORT_FIELDS), ...sort };

      return { sort: combinedSort };
    });
  };

  // Get user type from the response
  type User = UsersListResponse['results'][number];

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
          isLoading={isUserListLoading}
          onPageChange={(page) => setParams({ page })}
          onSortingChange={onSortingChange}
          onRowClick={onRowClick}
        />
      </Stack>
    </>
  );
};

export default Home;
