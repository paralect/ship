import { FC, useLayoutEffect, useState } from 'react';
import { ActionIcon, Group, Select, Stack, TextInput } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { useDebouncedValue, useInputState, useSetState } from '@mantine/hooks';
import { IconSearch, IconSelector, IconX } from '@tabler/icons-react';
import { useMobile } from 'hooks';
import { set } from 'lodash';

import { UserListParams } from 'resources/user';

import { getSortByOptions } from './helpers';

interface FiltersProps {
  setParams: ReturnType<typeof useSetState<UserListParams>>[1];
}

const Filters: FC<FiltersProps> = ({ setParams }) => {
  const isMobile = useMobile();

  const sortByOptions = getSortByOptions(isMobile);

  const [search, setSearch] = useInputState('');
  const [sortBy, setSortBy] = useState<string | null>(sortByOptions[0].value);
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
      <Group wrap="nowrap" component={isMobile ? Stack : undefined} flex={isMobile ? 1 : undefined}>
        <TextInput
          w={isMobile ? '100%' : 350}
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
          w={isMobile ? '100%' : 200}
          size="md"
          data={sortByOptions}
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

        <DatePickerInput
          valueFormat={isMobile ? 'YYYY-MM-DD' : undefined}
          type="range"
          size="md"
          placeholder="Pick date"
          value={filterDate}
          onChange={handleFilter}
        />
      </Group>
    </Group>
  );
};
export default Filters;
