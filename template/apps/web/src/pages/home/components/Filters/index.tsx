import React, { FC, useLayoutEffect, useState } from 'react';
import { ActionIcon, ComboboxItem, Group, Select, TextInput } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { useDebouncedValue, useInputState, useSetState } from '@mantine/hooks';
import { IconSearch, IconSelector, IconX } from '@tabler/icons-react';
import { set } from 'lodash';

import { UsersListParams } from 'resources/user';

const selectOptions: ComboboxItem[] = [
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
  },
];

interface FiltersProps {
  setParams: ReturnType<typeof useSetState<UsersListParams>>[1];
}

const Filters: FC<FiltersProps> = ({ setParams }) => {
  const [search, setSearch] = useInputState('');
  const [sortBy, setSortBy] = useState<string | null>(selectOptions[0].value);
  const [filterDate, setFilterDate] = useState<DatesRangeValue>();

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleSort = (value: string | null) => {
    setSortBy(value);

    setParams((old) => set(old, 'sort.createdOn', value === 'newest' ? 'desc' : 'asc'));
  };

  const handleFilter = ([startDate, endDate]: DatesRangeValue) => {
    setFilterDate([startDate, endDate]);

    if (!startDate) {
      setParams({ filter: undefined });
    }

    if (endDate) {
      setParams({
        filter: {
          createdOn: { startDate, endDate },
        },
      });
    }
  };

  useLayoutEffect(() => {
    setParams({ searchValue: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <Group wrap="nowrap" justify="space-between">
      <Group wrap="nowrap">
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

        <Select
          w={200}
          size="md"
          data={selectOptions}
          value={sortBy}
          onChange={handleSort}
          allowDeselect={false}
          rightSection={<IconSelector size={16} />}
          comboboxProps={{
            withinPortal: false,
            transitionProps: {
              transition: 'fade',
              duration: 120,
              timingFunction: 'ease-out',
            },
          }}
        />

        <DatePickerInput type="range" size="md" placeholder="Pick date" value={filterDate} onChange={handleFilter} />
      </Group>
    </Group>
  );
};
export default Filters;
