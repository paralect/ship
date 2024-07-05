import React from 'react';
import { Table } from '@tanstack/react-table';

export const TableContext = React.createContext<Table<any> | undefined>(undefined);

export const useTableContext = () => React.useContext(TableContext);
