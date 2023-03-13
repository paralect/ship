import { FC, ReactNode } from 'react';
import { UnstyledButton } from '@mantine/core';
import {
  IconSortAscending,
  IconSortDescending,
  IconArrowsSort,
} from '@tabler/icons-react';
import { ColumnDefTemplate, HeaderContext, HeaderGroup } from '@tanstack/react-table';

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
  <thead>
    {headerGroups.map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            colSpan={header.colSpan}
            style={{
              width: header.id === 'select' ? '24px' : 'auto',
            }}
          >
            {!header.isPlaceholder && (
              <UnstyledButton
                onClick={header.column.getToggleSortingHandler()}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  lineHeight: '16px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
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
          </th>
        ))}
      </tr>
    ))}
  </thead>
);

export default Thead;
