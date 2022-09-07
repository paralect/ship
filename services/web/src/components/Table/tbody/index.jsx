import PropTypes from 'prop-types';

const Tbody = ({ rows, flexRender }) => (
  <tbody>
    {rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            colSpan={cell.colSpan}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

Tbody.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    getVisibleCells: PropTypes.func,
  })).isRequired,
  flexRender: PropTypes.func.isRequired,
};

export default Tbody;
