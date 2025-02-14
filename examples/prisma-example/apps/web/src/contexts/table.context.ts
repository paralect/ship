import { createContext, useContext } from 'react';
import { RowData, Table } from '@tanstack/react-table';

export const TableContext = createContext<Table<unknown> | undefined>(undefined);

export const useTableContext = <T extends RowData>() => useContext(TableContext) as Table<T>;
