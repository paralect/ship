/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { ArrowUpIcon, ArrowDownIcon, ArrowDoubleIcon } from 'public/icons';

import styles from './TableHeadCell.module.css';

const TableHeadCell = ({
  column, sortBy, onSortBy, isSortable,
}) => {
  const {
    key, width, align, title, minWidth,
  } = column;

  const cellStyle = { flexBasis: width, textAlign: align, minWidth };

  function getSortedIcon(fieldName) {
    if (sortBy && sortBy.field === fieldName) {
      if (sortBy.direction === 1) {
        return <ArrowUpIcon />;
      }

      return <ArrowDownIcon />;
    }

    return <ArrowDoubleIcon />;
  }

  function handleSort() {
    if (!isSortable || !onSortBy) {
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
      {isSortable && getSortedIcon(key)}
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
  isSortable: PropTypes.bool,
};

TableHeadCell.defaultProps = {
  sortBy: null,
  onSortBy: noop,
  isSortable: false,
};

export default TableHeadCell;
