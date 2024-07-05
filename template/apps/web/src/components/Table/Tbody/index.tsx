import React from 'react';
import { Table } from '@mantine/core';
import { flexRender, RowData } from '@tanstack/react-table';

import { useTableContext } from 'contexts';

import styles from './index.module.css';

interface TbodyProps<T> {
  onRowClick?: (value: T) => void;
}

const Tbody = <T extends RowData>({ onRowClick }: TbodyProps<T>) => {
  const table = useTableContext();

  if (!table) return null;

  const { rows } = table.getRowModel();

  return (
    <Table.Tbody>
      {rows.map((row) => (
        <Table.Tr key={row.id} onClick={() => onRowClick && onRowClick(row.original)} classNames={{ tr: styles.tr }}>
          {row.getVisibleCells().map((cell) => (
            <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
          ))}
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default Tbody;
