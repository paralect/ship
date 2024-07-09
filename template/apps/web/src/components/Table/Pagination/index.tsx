import React, { FC } from 'react';
import { Group, Pagination as MantinePagination, PaginationProps as MantinePaginationProps, Text } from '@mantine/core';

import { useTableContext } from 'contexts';

interface PaginationProps extends Omit<MantinePaginationProps, 'total' | 'value'> {
  totalCount?: number;
}

const Pagination: FC<PaginationProps> = ({ totalCount, ...rest }) => {
  const table = useTableContext();

  if (!table) return null;

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  if (pageCount === 1) return null;

  return (
    <Group justify="flex-end">
      {totalCount && (
        <Text size="sm" c="gray.6">
          Showing <b>{table.getRowModel().rows.length}</b> of <b>{totalCount}</b> results
        </Text>
      )}

      <MantinePagination
        total={pageCount}
        value={currentPage + 1}
        onChange={(v) => table.setPageIndex(v - 1)}
        {...rest}
      />
    </Group>
  );
};
export default Pagination;
