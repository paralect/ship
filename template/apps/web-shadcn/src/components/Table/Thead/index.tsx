import { FC } from 'react';
import { flexRender, SortDirection } from '@tanstack/react-table';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';

import { useTableContext } from 'contexts';

import { Button } from '@/components/ui/button';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SortIconProps {
  state: false | SortDirection;
}

const SortIcon: FC<SortIconProps> = ({ state }) => {
  const iconSize = 16;

  switch (state) {
    case 'asc':
      return <SortAsc size={iconSize} />;
    case 'desc':
      return <SortDesc size={iconSize} />;
    case false:
      return <ArrowUpDown size={iconSize} />;
    default:
      return null;
  }
};

const Thead = () => {
  const table = useTableContext();

  if (!table) return null;

  const headerGroups = table.getHeaderGroups();

  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const isSortable = header.column.getCanSort();
            const headerContent = flexRender(header.column.columnDef.header, header.getContext());
            const columnSize = header.column.columnDef.size;
            const columnWidth = columnSize ? `${columnSize}%` : 'auto';

            return (
              <TableHead key={header.id} colSpan={header.colSpan} style={{ width: columnWidth }}>
                {!header.isPlaceholder &&
                  (isSortable ? (
                    <Button variant="ghost" onClick={header.column.getToggleSortingHandler()} className="-ml-4 gap-2">
                      {headerContent}
                      <SortIcon state={header.column.getIsSorted()} />
                    </Button>
                  ) : (
                    headerContent
                  ))}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export default Thead;
