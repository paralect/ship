import { useCallback, useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import {
  Select,
  TextInput,
  Group,
  Title,
  Stack,
  Grid,
  Skeleton,
  Table,
  Text,
  Container,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconChevronDown, IconSearch } from '@tabler/icons';
import { userApi } from 'resources/user';

const selectOptions = [
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
  },
];

const columns = [
  {
    width: '33.3%',
    key: 'firstName',
    title: 'First Name',
  },
  {
    width: '33.3%',
    key: 'lastName',
    title: 'Last Name',
  },
  {
    width: '33.4%',
    key: 'email',
    title: 'Email',
  },
];

const Home = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(selectOptions[0].value);

  const [params, setParams] = useState({});

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const onPageChange = useCallback((currentPage) => {
    setPage(currentPage);
    setParams((prev) => ({ ...prev, page: currentPage }));
  }, []);

  const handleSort = useCallback((value) => {
    setSort(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'newest' ? { createdOn: -1 } : { createdOn: 1 },
    }));
  }, [setParams]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch }));
    setPage(1);
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
            height={40}
            radius="sm"
            visible={isListLoading}
            width={'auto'}
            style={{ flexGrow: '0.25' }}
          >
            <TextInput
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or email"
              icon={<IconSearch size={16} />}
            />
          </Skeleton>
          <Skeleton
            height={40}
            radius="sm"
            visible={isListLoading}
            width={'auto'}
            style={{ overflow: !isListLoading ? 'initial' : 'overflow' }}
          >
            <Select
              size="sm"
              data={selectOptions}
              value={sort}
              onChange={handleSort}
              rightSection={<IconChevronDown size={16} />}
              withinPortal={false}
            />
          </Skeleton>
        </Group>
        {isListLoading && (
          <>
            {[1, 2, 3].map(item => (
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
            horizontalSpacing="lg"
            verticalSpacing="md"
          >
            <thead>
              <tr>
                {columns.map(({ title }, index) => (
                  <th key={`${title}-${String(index)}`}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map(({ firstName, lastName, email, _id }) => (
                <tr key={_id}>
                  <td>{firstName}</td>
                  <td>{lastName}</td>
                  <td>{email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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
