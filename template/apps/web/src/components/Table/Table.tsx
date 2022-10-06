/* eslint-disable */

import { useMemo, useCallback, useState, FC } from 'react';
import {
  Table as TableContainer,
  Checkbox,
  Pagination,
  Group,
  Text,
  Paper,
} from '@mantine/core';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import Thead from './thead';
import Tbody from './tbody';

type SpacingSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface TableProps {
  data: RowData[];
  dataCount?: number;
  columns: ColumnDef<any>[];
  horizontalSpacing?: SpacingSizes;
  verticalSpacing?: SpacingSizes;
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onPageChange?: (value: Record<string, any>) => void;
  perPage: number;
}

const Table: FC<TableProps> = ({
  data,
  dataCount,
  columns,
  horizontalSpacing = 'xl',
  verticalSpacing = 'lg',
  rowSelection,
  setRowSelection,
  sorting,
  onSortingChange,
  onPageChange,
  perPage,
}) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: perPage,
  });
  const isSelectable = !!rowSelection && !!setRowSelection;

  const selectableColumns: ColumnDef<unknown, any>[] = useMemo(() => [{
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }], []);

  const pagination = useMemo(() => ({
    pageIndex,
    pageSize,
  }), [pageIndex, pageSize]);

  const onPageChangeHandler = useCallback((currentPage: any) => {
    setPagination({ pageIndex: currentPage, pageSize });

    if (onPageChange) {
      onPageChange((prev: Record<string, any>) => ({ ...prev, page: currentPage }));
    }
  }, [onPageChange, pageSize]);

  const table = useReactTable({
    data,
    columns: isSelectable ? [...selectableColumns, ...columns] : columns,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
    onSortingChange,
    onPaginationChange: onPageChangeHandler,
    pageCount: Math.ceil((dataCount || 0) / perPage),
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Paper radius="sm" withBorder>
        <TableContainer
          horizontalSpacing={horizontalSpacing}
          verticalSpacing={verticalSpacing}
        >
          <Thead
            headerGroups={table.getHeaderGroups()}
            flexRender={flexRender}
          />
          <Tbody
            rows={table.getRowModel().rows}
            flexRender={flexRender}
          />
        </TableContainer>
      </Paper>
      <Group position="right">
        <Text size="sm" color="dimmed">
          Showing
          {' '}
          <b>{table.getRowModel().rows.length}</b>
          {' '}
          of
          {' '}
          <b>{dataCount}</b>
          {' '}
          results
        </Text>
        <Pagination
          total={table.getPageCount()}
          page={table.getState().pagination.pageIndex}
          onChange={onPageChangeHandler}
          color="black"
        />
      </Group>
    </>
  );
};

export default Table;
