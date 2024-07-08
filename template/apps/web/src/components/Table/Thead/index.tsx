import React, { FC } from 'react';
import { Table, UnstyledButton } from '@mantine/core';
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { flexRender, SortDirection } from '@tanstack/react-table';

import { useTableContext } from 'contexts';

import classes from './index.module.css';

interface SortIconProps {
  state: false | SortDirection;
}

const SortIcon: FC<SortIconProps> = ({ state }) => {
  const iconSize = 16;

  switch (state) {
    case 'asc':
      return <IconSortAscending size={iconSize} />;
    case 'desc':
      return <IconSortDescending size={iconSize} />;
    case false:
      return <IconArrowsSort size={iconSize} />;
    default:
      return null;
  }
};

const Thead = () => {
  const table = useTableContext();

  if (!table) return null;

  const headerGroups = table.getHeaderGroups();

  return (
    <Table.Thead>
      {headerGroups.map((headerGroup) => (
        <Table.Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const isSortable = header.column.getCanSort();

            const headerContent = flexRender(header.column.columnDef.header, header.getContext());
            const columnSize = header.column.columnDef.size;
            const columnWidth = columnSize ? `${columnSize}%` : 'auto';

            return (
              <Table.Th key={header.id} colSpan={header.colSpan} style={{ width: columnWidth }}>
                {!header.isPlaceholder &&
                  (isSortable ? (
                    <UnstyledButton onClick={header.column.getToggleSortingHandler()} className={classes.headerButton}>
                      {headerContent}

                      <SortIcon state={header.column.getIsSorted()} />
                    </UnstyledButton>
                  ) : (
                    headerContent
                  ))}
              </Table.Th>
            );
          })}
        </Table.Tr>
      ))}
    </Table.Thead>
  );
};

export default Thead;
