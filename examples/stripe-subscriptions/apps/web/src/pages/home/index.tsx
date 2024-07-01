import React, { useCallback, useLayoutEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ActionIcon, Container, Group, Select, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
import { DatePickerInput, DatesRangeValue, DateValue } from '@mantine/dates';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { IconSearch, IconSelector, IconX } from '@tabler/icons-react';
import { RowSelectionState, SortingState } from '@tanstack/react-table';

import { userApi } from 'resources/user';

import { Table } from 'components';

import { ListParams, SortOrder } from 'types';

import { columns, PER_PAGE, selectOptions } from './constants';

import classes from './index.module.css';

type FilterParams = {
  createdOn?: {
    startDate: DateValue;
    endDate: DateValue;
  };
};

type SortParams = {
  createdOn?: SortOrder;
};

type UsersListParams = ListParams<FilterParams, SortParams>;

const Home: NextPage = () => {
  const [search, setSearch] = useInputState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortBy, setSortBy] = useState<string | null>(selectOptions[0].value);
  const [filterDate, setFilterDate] = useState<DatesRangeValue>();

  const [params, setParams] = useState<UsersListParams>({});

  const [debouncedSearch] = useDebouncedValue(search, 500);
  const handleSort = useCallback((value: string | null) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'newest' ? { createdOn: 'desc' } : { createdOn: 'asc' },
    }));
  }, []);

  const handleFilter = useCallback(([startDate, endDate]: DatesRangeValue) => {
    setFilterDate([startDate, endDate]);

    if (!startDate) {
      setParams((prev) => ({
        ...prev,
        filter: {},
      }));
    }

    if (endDate) {
      setParams((prev) => ({
        ...prev,
        filter: { createdOn: { startDate, endDate } },
      }));
    }
  }, []);

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
  }, [debouncedSearch]);

  const { data: users, isLoading: isUserListLoading } = userApi.useList(params);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <Stack gap="lg">
        <Title order={2}>Users</Title>

        <Group wrap="nowrap" justify="space-between">
          <Group wrap="nowrap">
            <Skeleton
              className={classes.inputSkeleton}
              height={42}
              radius="sm"
              visible={isUserListLoading}
              width="auto"
            >
              <TextInput
                w={350}
                size="md"
                value={search}
                onChange={setSearch}
                placeholder="Search by name or email"
                leftSection={<IconSearch size={16} />}
                rightSection={
                  search && (
                    <ActionIcon variant="transparent" onClick={() => setSearch('')}>
                      <IconX color="gray" stroke={1} />
                    </ActionIcon>
                  )
                }
              />
            </Skeleton>

            <Skeleton width="auto" height={42} radius="sm" visible={isUserListLoading}>
              <Select
                w={200}
                size="md"
                data={selectOptions}
                value={sortBy}
                onChange={handleSort}
                rightSection={<IconSelector size={16} />}
                comboboxProps={{
                  withinPortal: false,
                  transitionProps: {
                    transition: 'pop-bottom-right',
                    duration: 210,
                    timingFunction: 'ease-out',
                  },
                }}
              />
            </Skeleton>

            <Skeleton
              className={classes.datePickerSkeleton}
              height={42}
              radius="sm"
              visible={isUserListLoading}
              width="auto"
            >
              <DatePickerInput
                type="range"
                size="md"
                placeholder="Pick date"
                value={filterDate}
                onChange={handleFilter}
              />
            </Skeleton>
          </Group>
        </Group>

        {isUserListLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <Skeleton key={`sklton-${String(item)}`} height={50} radius="sm" mb="sm" />
            ))}
          </>
        )}

        {users?.results.length ? (
          <Table
            columns={columns}
            data={users.results}
            dataCount={users.count}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            onSortingChange={setSorting}
            onPageChange={setParams}
            perPage={PER_PAGE}
          />
        ) : (
          <Container p={75}>
            <Text size="xl" c="gray">
              No results found, try to adjust your search.
            </Text>
          </Container>
        )}
      </Stack>
    </>
  );
};

export default Home;
