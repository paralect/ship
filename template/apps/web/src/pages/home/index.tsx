import { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Select,
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Text,
  Container,
  UnstyledButton,
  SelectItem,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconChevronDown, IconSearch, IconX } from '@tabler/icons';
import { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';

import { Table } from 'components';
import { User, userApi } from 'resources/user';

interface UsersListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: number;
  };
}

const selectOptions: SelectItem[] = [
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
  },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  },
];

const PER_PAGE = 5;

const Home: NextPage = () => {
  const [search, setSearch] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortBy, setSortBy] = useState(selectOptions[0].value);

  const [params, setParams] = useState<UsersListParams>({});

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleSort = useCallback((value: string) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'newest' ? { createdOn: -1 } : { createdOn: 1 },
    }));
  }, []);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
  }, [debouncedSearch]);

  const { data, isLoading: isListLoading } = userApi.useList(params);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Stack spacing="lg">
        <Title order={2}>Users</Title>
        <Group position="apart">
          <Skeleton
            height={42}
            radius="sm"
            visible={isListLoading}
            width="auto"
            sx={{ flexGrow: 0.25 }}
          >
            <TextInput
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or email"
              icon={<IconSearch size={16} />}
              rightSection={search ? (
                <UnstyledButton
                  onClick={() => setSearch('')}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <IconX color="gray" />
                </UnstyledButton>
              ) : null}
            />
          </Skeleton>
          <Skeleton
            height={42}
            radius="sm"
            visible={isListLoading}
            width="auto"
            sx={{ overflow: !isListLoading ? 'initial' : 'overflow' }}
          >
            <Select
              data={selectOptions}
              value={sortBy}
              onChange={handleSort}
              rightSection={<IconChevronDown size={16} />}
              withinPortal={false}
              transition="pop-bottom-right"
              transitionDuration={210}
              transitionTimingFunction="ease-out"
            />
          </Skeleton>
        </Group>
        {isListLoading && (
        <>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={`sklton-${String(item)}`}
              height={50}
              radius="sm"
              mb="sm"
            />
          ))}
        </>
        )}
        {data?.items.length ? (
          <Table
            columns={columns}
            data={data.items}
            dataCount={data.count}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            onSortingChange={setSorting}
            onPageChange={setParams}
            perPage={PER_PAGE}
          />
        ) : (
          <Container p={75}>
            <Text size="xl" color="grey">
              No results found, try to adjust your search.
            </Text>
          </Container>
        )}
      </Stack>
    </>
  );
};

export default Home;
