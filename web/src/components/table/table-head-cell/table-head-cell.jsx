/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import Icon from 'components/icon';

import styles from './table-head-cell.styles.pcss';

const TableHeadCell = ({
  column, sortBy, onSortBy, noSort,
}) => {
  const {
    key, width, align, title, minWidth,
  } = column;

  const cellStyle = { flexBasis: width, textAlign: align, minWidth };

  function getSortedIcon(fieldName) {
    if (sortBy && sortBy.field === fieldName) {
      if (sortBy.direction === 1) {
        return 'arrowUpSmall';
      }

      return 'arrowDownSmall';
    }

    return 'arrowDouble';
  }

  function handleSort() {
    if (noSort || !onSortBy) {
      return;
    }
    let newSortBy = {
      ...sortBy,
    };

    if (!sortBy || sortBy.field !== key) {
      newSortBy.field = key;
      newSortBy.direction = 1;
    } else if (sortBy.direction === 1) {
      newSortBy.direction = -1;
    } else {
      // reset sorting
      newSortBy = null;
    }
    onSortBy(newSortBy);
  }

  return (
    <div
      className={styles.headCell}
      onClick={handleSort}
      style={cellStyle}
    >
      {title}
      {!noSort && (
        <Icon
          icon={getSortedIcon(key)}
          noWrapper
        />
      )}
    </div>
  );
};

TableHeadCell.propTypes = {
  column: PropTypes.shape({
    key: PropTypes.string,
    width: PropTypes.string,
    title: PropTypes.string,
    align: PropTypes.string,
    minWidth: PropTypes.string,
  }).isRequired,
  sortBy: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.number,
  }),
  onSortBy: PropTypes.func,
  noSort: PropTypes.bool,
};

TableHeadCell.defaultProps = {
  sortBy: null,
  onSortBy: noop,
  noSort: false,
};

export default TableHeadCell;
