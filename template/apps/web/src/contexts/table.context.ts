import React from 'react';
import { RowData, Table } from '@tanstack/react-table';

export const TableContext = React.createContext<Table<unknown> | undefined>(undefined);

export const useTableContext = <T extends RowData>() => React.useContext(TableContext) as Table<T>;
