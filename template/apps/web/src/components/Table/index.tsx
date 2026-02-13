import { ComponentType, useCallback, useEffect, useMemo, useState } from 'react';
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
import TablePagination from './Pagination';
import Tbody from './Tbody';
import Thead from './Thead';

import { Card } from '@/components/ui/card';
import { Table as TableContainer } from '@/components/ui/table';

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
  EmptyState?: ComponentType;
  LoadingState?: ComponentType;
}

const Table = <T extends RowData>({
  data,
  totalCount = data?.length || 0,
  columns,
  pageCount,
  page = 1,
  perPage = 10,
  isLoading,
  onSortingChange,
  onPageChange,
  onRowClick,
  EmptyState = TableEmptyState,
  LoadingState = TableLoadingState,
}: TableProps<T>) => {
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: (page && page - 1) || 0,
    pageSize: perPage,
  });
  const setPagination = useCallback(
    (value: Partial<PaginationState> | ((prev: PaginationState) => Partial<PaginationState>)) => {
      setPaginationState((prev) => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        return { ...prev, ...newValue };
      });
    },
    [],
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<T>({
    data: data || [],
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
    <TableContext value={useMemo(() => table as TanstackTable<T | unknown>, [table])}>
      {isLoading && <LoadingState />}

      {!isLoading &&
        (totalCount > 0 ? (
          <div className="flex flex-col gap-4">
            <Card className="overflow-hidden py-0">
              <TableContainer>
                <Thead />
                <Tbody<T> onRowClick={onRowClick} />
              </TableContainer>
            </Card>

            <TablePagination totalCount={totalCount} />
          </div>
        ) : (
          <EmptyState />
        ))}
    </TableContext>
  );
};

export default Table;
