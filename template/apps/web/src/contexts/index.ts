import { createContext, use } from 'react';
import { RowData, Table } from '@tanstack/react-table';

export const TableContext = createContext<Table<unknown> | null>(null);

export function useTableContext<T extends RowData = unknown>() {
  return use(TableContext) as Table<T> | null;
}
