import { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table as TableContainer,
  Checkbox,
  Pagination,
  Group,
  Text,
  Paper,
} from '@mantine/core';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import Thead from './thead';
import Tbody from './tbody';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

const Table = ({
  data,
  dataCount,
  columns,
  horizontalSpacing,
  verticalSpacing,
  rowSelection,
  setRowSelection,
  sorting,
  onSortingChange,
  onPageChange,
  perPage,
}) => {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 1,
    pageSize: perPage,
  });
  const isSelectable = !!rowSelection && !!setRowSelection;

  const selectableColumns = useMemo(() => [
    {
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
    },
  ], []);

  const pagination = useMemo(() => ({
    pageIndex,
    pageSize,
  }), [pageIndex, pageSize]);

  const onPageChangeHandler = useCallback((currentPage) => {
    setPagination({ pageIndex: currentPage, pageSize });
    onPageChange((prev) => ({ ...prev, page: currentPage }));
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
    pageCount: Math.ceil(dataCount / perPage),
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

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.bool,
    ]),
  )).isRequired,
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]))).isRequired,
  horizontalSpacing: PropTypes.oneOf(SIZES),
  verticalSpacing: PropTypes.oneOf(SIZES),
  rowSelection: PropTypes.objectOf(PropTypes.bool),
  setRowSelection: PropTypes.func,
  sorting: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]))),
  onSortingChange: PropTypes.func,
  onPageChange: PropTypes.func,
  perPage: PropTypes.number,
  dataCount: PropTypes.number,
};

Table.defaultProps = {
  horizontalSpacing: 'xl',
  verticalSpacing: 'lg',
  rowSelection: null,
  setRowSelection: () => {},
  sorting: null,
  onSortingChange: () => {},
  onPageChange: () => {},
  perPage: null,
  dataCount: null,
};

export default Table;
