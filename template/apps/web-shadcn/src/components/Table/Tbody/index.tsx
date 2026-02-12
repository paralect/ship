import { flexRender, RowData } from '@tanstack/react-table';

import { useTableContext } from 'contexts';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';

interface TbodyProps<T> {
  onRowClick?: (value: T) => void;
}

const Tbody = <T extends RowData>({ onRowClick }: TbodyProps<T>) => {
  const table = useTableContext<T>();

  if (!table) return null;

  const { rows } = table.getRowModel();

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          onClick={() => onRowClick && onRowClick(row.original)}
          className={onRowClick ? 'cursor-pointer' : ''}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default Tbody;
