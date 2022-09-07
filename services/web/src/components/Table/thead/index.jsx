import PropTypes from 'prop-types';
import { UnstyledButton } from '@mantine/core';
import {
  IconSortAscending,
  IconSortDescending,
  IconArrowsSort,
} from '@tabler/icons';

const Thead = ({ headerGroups, flexRender }) => (
  <thead>
    {headerGroups.map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            colSpan={header.colSpan}
            style={{
              width: header.id === 'select' ? '24px' : 'auto',
            }}
          >
            {!header.isPlaceholder && (
              <UnstyledButton
                onClick={header.column.getToggleSortingHandler()}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItem: 'center',
                  justifyContent: 'space-between',
                  lineHeight: '16px',
                }}
              >
                {
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                }
                {header.id !== 'select' && ({
                  false: <IconArrowsSort size={16} />,
                  asc: <IconSortAscending size={16} />,
                  desc: <IconSortDescending size={16} />,
                }[header.column.getIsSorted()] ?? null)}
              </UnstyledButton>
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
);

Thead.propTypes = {
  headerGroups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    headers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.func,
      PropTypes.bool,
    ]))),
  })).isRequired,
  flexRender: PropTypes.func.isRequired,
};

export default Thead;
