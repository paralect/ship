import { useCallback, useLayoutEffect, useState } from 'react';
import cn from 'classnames';
import Head from 'next/head';

import { useFetch } from 'hooks/use-fetch';
import useDebounce from 'hooks/use-debounce';

import { list } from 'resources/user/user.api';

import Table from 'components/Table';
import Input from 'components/Input';
import Select from 'components/Select';
import Spinner from 'components/Spinner';

import styles from './styles.module.css';

const selectOptions = [
  {
    value: { createdOn: -1 },
    label: 'Newest',
  },
  {
    value: { createdOn: 1 },
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
  const [sort, setSort] = useState(selectOptions[0]);

  const [params, setParams] = useState({});

  const debouncedSearch = useDebounce(search);

  const onPageChange = useCallback((currentPage) => {
    setPage(currentPage);
    setParams((prev) => ({ ...prev, page: currentPage }));
  }, []);

  const handleSort = useCallback((currentSort) => {
    setSort(currentSort);
    setParams((prev) => ({ ...prev, sort: currentSort.value }));
  }, []);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch }));
    setPage(1);
  }, [debouncedSearch]);

  const { data, loading } = useFetch(list, { params });

  if (loading && data === null) {
    return (
      <div className={styles.helperContainer}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <h2 className={styles.title}>Users</h2>
      <div className={cn({
        [styles.loading]: loading,
      }, styles.container)}
      >
        <div className={styles.sortBarContainer}>
          <Input
            value={search}
            onChange={handleSearch}
            placeholder="Search by name or email"
            className={styles.searchField}
          />
          <Select
            size="s"
            prefixOfSelected="Sort by:"
            defaultValue={selectOptions[0]}
            value={sort}
            options={selectOptions}
            onChange={handleSort}
            className={styles.select}
          />
        </div>
        {data?.items.length ? (
          <Table
            items={data.items}
            columns={columns}
            totalCount={data.count}
            totalPages={data.totalPages}
            onPageChange={onPageChange}
            page={page}
            perPage={10}
          />
        ) : (
          <div className={styles.helperContainer}>
            No results found, try to adjust your search.
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
