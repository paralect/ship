import { ComponentType, useCallback, useMemo, useState } from "react";
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
} from "@tanstack/react-table";

import { TableContext } from "contexts";

import TableEmptyState from "./empty-state";
import TableLoadingState from "./loading-state";
import TablePagination from "./pagination";
import Tbody from "./tbody";
import Thead from "./thead";

import { Card } from "@/components/ui/card";
import { Table as TableContainer } from "@/components/ui/table";

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
    (
      value:
        | Partial<PaginationState>
        | ((prev: PaginationState) => Partial<PaginationState>),
    ) => {
      setPaginationState((prev) => {
        const newValue = typeof value === "function" ? value(prev) : value;
        return { ...prev, ...newValue };
      });
    },
    [],
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      setSorting((prev) => {
        const newSorting =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue;
        if (onSortingChange) {
          onSortingChange(
            newSorting.reduce<SortingFieldsState>((acc, value) => {
              acc[value.id] = value.desc ? "desc" : "asc";
              return acc;
            }, {}),
          );
        }
        return newSorting;
      });
    },
    [onSortingChange],
  );

  const table = useReactTable<T>({
    data: data || [],
    columns: columns.map((c) => ({
      ...c,
      enableSorting: c.enableSorting || false,
      size: 0,
    })),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: (updaterOrValue) => {
      setPagination((prev) => {
        const newValue =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue;
        if (onPageChange) {
          onPageChange(newValue.pageIndex + 1);
        }
        return newValue;
      });
    },
    pageCount:
      pageCount || (totalCount ? Math.ceil((totalCount || 0) / perPage) : -1),
    manualPagination: true,
    onSortingChange: handleSortingChange,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TableContext
      value={useMemo(() => table as TanstackTable<T | unknown>, [table])}
    >
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
