import { useMemo } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Stack, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { SortDirection } from '@tanstack/react-table';
import { useMobile } from 'hooks';
import { pick } from 'lodash';

import { userApi, UserListParams } from 'resources/user';

import { InfiniteScrollContainer, Table } from 'components';

import { User } from 'types';

import Filters from './components/Filters';
import UserCard from './components/UserCard';
import { COLUMNS, DEFAULT_PAGE, DEFAULT_PARAMS, EXTERNAL_SORT_FIELDS, PER_PAGE } from './constants';

const Home: NextPage = () => {
  const [params, setParams] = useSetState<UserListParams>(DEFAULT_PARAMS);

  const isMobile = useMobile();

  const { data: users, isLoading: isUserListLoading } = userApi.useList(params, { enabled: !isMobile });

  const {
    data: usersInfinityListData,
    isLoading: isUserInfinityListLoading,
    hasNextPage: hasUsersInfinityListNextPage,
    fetchNextPage: fetchUsersInfinityListNextPage,
    isFetchingNextPage: isFetchingUsersInfinityListNextPage,
  } = userApi.useInfinityList(params, { enabled: isMobile });

  const onSortingChange = (sort: Record<string, SortDirection>) => {
    setParams((prev) => {
      const combinedSort = { ...pick(prev.sort, EXTERNAL_SORT_FIELDS), ...sort };

      return { sort: combinedSort };
    });
  };

  const onUserClick = (user: User) => {
    showNotification({
      title: 'Success',
      message: `You clicked on the row for the user with the email address ${user.email}.`,
      color: 'green',
    });
  };

  const displayedUsersCards = useMemo(() => {
    if (!isMobile) {
      return null;
    }

    return usersInfinityListData?.pages
      .flatMap((p) => p.results)
      .map((user) => <UserCard key={user._id} user={user} onClick={onUserClick} />);
  }, [isMobile, usersInfinityListData?.pages]);

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <Stack gap="lg">
        <Title order={2}>Users</Title>

        <Filters setParams={setParams} />

        {isMobile && (
          <InfiniteScrollContainer
            isLoading={isUserInfinityListLoading}
            isFetchingNextPage={isFetchingUsersInfinityListNextPage}
            hasMore={hasUsersInfinityListNextPage}
            fetchNextData={fetchUsersInfinityListNextPage}
          >
            <Stack>{displayedUsersCards}</Stack>
          </InfiniteScrollContainer>
        )}

        {!isMobile && (
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
            onRowClick={onUserClick}
          />
        )}
      </Stack>
    </>
  );
};

export default Home;
