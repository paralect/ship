import React, { ComponentType, useEffect, useMemo, useState } from 'react';
import { Paper, Stack, Table as TableContainer, TableProps as TableContainerProps } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  RowData,
  SortDirection,
  SortingState,
  Table as TanstackTable,
  useReactTable,
} from '@tanstack/react-table';

import { TableContext } from 'contexts';

import TableEmptyState from './EmptyState';
import TableLoadingState from './LoadingState';
import Pagination from './Pagination';
import Tbody from './Tbody';
import Thead from './Thead';

type SortingFieldsState = Record<string, SortDirection>;

interface TableProps<T> {
  data?: T[];
  totalCount?: number;
  columns: ColumnDef<T>[];
  pageCount?: number;
  page?: number;
  perPage?: number;
  isLoading?: boolean;
  onSortingChange?: (sort: SortingFieldsState) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (value: T) => void;
  tableContainerProps?: TableContainerProps;
  EmptyState?: ComponentType;
  LoadingState?: ComponentType;
}

const Table = <T extends RowData>({
  data = [],
  totalCount = data?.length || 0,
  columns,
  pageCount,
  page = 1,
  perPage = 10,
  isLoading,
  onSortingChange,
  onPageChange,
  onRowClick,
  tableContainerProps,
  EmptyState = TableEmptyState,
  LoadingState = TableLoadingState,
}: TableProps<T>) => {
  const [pagination, setPagination] = useSetState<PaginationState>({
    pageIndex: (page && page - 1) || 0,
    pageSize: perPage,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<T>({
    data,
    // disable column sorting and reset size by default.
    columns: columns.map((c) => ({ ...c, enableSorting: c.enableSorting || false, size: 0 })),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    pageCount: pageCount || (totalCount ? Math.ceil((totalCount || 0) / perPage) : -1),
    manualPagination: true,
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (onSortingChange) {
      onSortingChange(
        sorting.reduce<SortingFieldsState>((acc, value) => {
          acc[value.id] = value.desc ? 'desc' : 'asc';

          return acc;
        }, {}),
      );
    }
  }, [sorting]);

  useEffect(() => {
    if (onPageChange) onPageChange(pagination.pageIndex + 1);
  }, [pagination]);

  return (
    <TableContext.Provider value={useMemo(() => table as TanstackTable<T | unknown>, [table])}>
      {isLoading && <LoadingState />}

      {!isLoading &&
        (totalCount > 0 ? (
          <Stack gap="lg">
            <Paper radius="md" withBorder>
              <TableContainer horizontalSpacing="xl" verticalSpacing="lg" {...tableContainerProps}>
                <Thead />
                <Tbody<T> onRowClick={onRowClick} />
              </TableContainer>
            </Paper>

            <Pagination totalCount={totalCount} />
          </Stack>
        ) : (
          <EmptyState />
        ))}
    </TableContext.Provider>
  );
};

export default Table;
