import { createContext, use } from 'react';
import { RowData, Table } from '@tanstack/react-table';

export const TableContext = createContext<Table<unknown> | undefined>(undefined);

export const useTableContext = <T extends RowData>() => use(TableContext) as Table<T>;
