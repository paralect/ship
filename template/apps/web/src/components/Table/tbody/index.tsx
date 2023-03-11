import { FC, ReactNode } from 'react';
import { CellContext, ColumnDefTemplate, Row } from '@tanstack/react-table';
import { useMantineTheme } from '@mantine/core';

type RowData = {
  [key: string]: string | number | boolean | Record<string, any>;
};

interface TbodyProps {
  isSelectable: boolean,
  rows: Row<RowData>[];
  flexRender: (
    template: ColumnDefTemplate<CellContext<RowData, any>> | undefined,
    context: CellContext<RowData, any>
  ) => ReactNode;
}

const Tbody: FC<TbodyProps> = ({ isSelectable, rows, flexRender }) => {
  const { colors } = useMantineTheme();

  return (
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.id}
          style={{
            ...(isSelectable && row.getIsSelected() && {
              backgroundColor: colors.blue[0],
            }),
            fontWeight: '400',
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default Tbody;
