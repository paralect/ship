import { FC, ReactNode } from 'react';
import { Table, UnstyledButton } from '@mantine/core';
import {
  IconSortAscending,
  IconSortDescending,
  IconArrowsSort,
} from '@tabler/icons-react';
import { ColumnDefTemplate, HeaderContext, HeaderGroup } from '@tanstack/react-table';

import classes from './thead.module.css';

type CellData = {
  [key: string]: string | Function | boolean | Record<string, any>;
};

interface TheadProps {
  isSortable: boolean,
  headerGroups: HeaderGroup<CellData>[];
  flexRender: (
    template: ColumnDefTemplate<HeaderContext<CellData, any>> | undefined,
    context: HeaderContext<CellData, any>
  ) => ReactNode;
}

const Thead: FC<TheadProps> = ({ isSortable, headerGroups, flexRender }) => (
  <Table.Thead>
    {headerGroups.map((headerGroup) => (
      <Table.Tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <Table.Th
            key={header.id}
            colSpan={header.colSpan}
            style={{
              width: header.id === 'select' ? '24px' : 'auto',
            }}
          >
            {!header.isPlaceholder && (
              <UnstyledButton
                className={classes.headerButton}
                w="100%"
                display="flex"
                lh="16px"
                fw={600}
                fz={14}
                onClick={header.column.getToggleSortingHandler()}
              >
                {
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                }
                {isSortable && header.id !== 'select' && ({
                  false: <IconArrowsSort size={16} />,
                  asc: <IconSortAscending size={16} />,
                  desc: <IconSortDescending size={16} />,
                }[String(header.column.getIsSorted())] ?? null)}
              </UnstyledButton>
            )}
          </Table.Th>
        ))}
      </Table.Tr>
    ))}
  </Table.Thead>
);

export default Thead;
