import { useCallback, useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import {
  Select,
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Table,
  Text,
  Container,
  Pagination,
  Paper,
  UnstyledButton,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconChevronDown, IconSearch, IconX } from '@tabler/icons';
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

const PER_PAGE = 5;

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
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading: isListLoading } = userApi.useList(params);

  const totalPages = data?.count ? Math.ceil(data.count / PER_PAGE) : 1;

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
            sx={{ flexGrow: '0.25' }}
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
              value={sort}
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
          <>
            <Paper radius="sm" withBorder>
              <Table
                horizontalSpacing="xl"
                verticalSpacing="lg"
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
            </Paper>
            {data?.count > PER_PAGE && (
              <Group position="right">
                <Text size="sm" color="dimmed">
                  Showing
                  {' '}
                  <b>{PER_PAGE}</b>
                  {' '}
                  of
                  {' '}
                  <b>{data?.count}</b>
                  {' '}
                  results
                </Text>
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={onPageChange}
                  color="black"
                />
              </Group>
            )}
          </>
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
