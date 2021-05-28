import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import differenceBy from 'lodash/differenceBy';

import Checkbox from 'components/Checkbox';

import TableHeadCell from './TableHeadCell/TableHeadCell';
import TableFooter from './TableFooter/TableFooter';
import styles from './Table.module.css';

const Table = ({
  items, columns, totalCount, totalPages, onPageChange,
  page, perPage, checkable, paginationWithStroke,
}) => {
  const [sortBy, setSortBy] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(page - 1);

  const allChecked = items.every((item) => checkedItems.some(
    (checkedItem) => checkedItem.id === item.id,
  ));

  const fullWidth = columns.reduce((sum, col) => sum + Number(col.width.replace('%', '')), 0);

  if (fullWidth !== 100) {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
      console.warn('Table full width !== 100:', fullWidth); // eslint-disable-line no-console
    }
  }

  const changePage = useCallback((current) => {
    onPageChange(current.selected + 1);
    setCurrentPage(current.selected);
  }, [onPageChange]);

  useEffect(() => {
    setCurrentPage(page - 1);
  }, [page]);

  const handleSortBy = (newSortBy) => setSortBy(newSortBy);

  const handleAllCheck = () => {
    if (allChecked) {
      setCheckedItems(differenceBy(checkedItems, items));
    } else {
      setCheckedItems([...checkedItems, ...items]);
    }
  };

  function renderCell(item, col) {
    const {
      key, width, align, render,
    } = col;
    const value = item[key] || '';

    const cellStyle = {
      flexBasis: width,
      textAlign: align,
    };

    return (
      <div
        className={styles.cell}
        key={key}
        style={cellStyle}
      >
        {render ? render(item) : value}
      </div>
    );
  }

  function renderRow(item, id, checked) {
    const handleItemCheck = () => {
      const changedItem = items.find((i) => i.id === id);
      if (!checked) {
        const mergedItems = [...checkedItems, changedItem];
        setCheckedItems(mergedItems);
      } else {
        const filteredItems = checkedItems.filter((i) => i.id !== id);
        setCheckedItems(filteredItems);
      }
    };

    return (
      <div
        className={styles.row}
        key={id}
      >
        {checkable && (
          <div className={cn(styles.cell, styles.checkable)}>
            <Checkbox
              id={id}
              value={checked}
              onChange={handleItemCheck}
            />
          </div>
        )}
        {columns.map((col) => renderCell(item, col))}
      </div>
    );
  }

  function renderBody() {
    if (items.length === 0) {
      return null;
    }

    const checkedIds = checkedItems ? checkedItems.map((item) => item.id) : [];

    return (
      <>
        <div className={styles.body}>
          {items.map((item, ix) => renderRow(item, item.id || ix, checkedIds.includes(item.id)))}
        </div>
        <TableFooter
          count={totalCount}
          pagesCount={totalPages}
          perPage={perPage}
          onPageChange={changePage}
          page={currentPage}
          paginationWithStroke={paginationWithStroke}
        />
      </>
    );
  }

  return (
    <div className={styles.table}>
      <div
        className={styles.head}
      >
        {checkable && (
          <div className={cn(styles.headCellCheckable)}>
            <Checkbox
              disabled={items.length === 0}
              value={allChecked}
              onChange={handleAllCheck}
            />
          </div>
        )}
        {columns.map((column) => (
          <TableHeadCell
            key={column.key}
            column={column}
            sortBy={sortBy}
            onSortBy={handleSortBy}
            isSortable={column.isSortable}
          />
        ))}
      </div>
      {renderBody()}
    </div>
  );
};

Table.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortBy: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.number,
  }),
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    width: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  totalCount: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number,
  checkable: PropTypes.bool,
  paginationWithStroke: PropTypes.bool,
};

Table.defaultProps = {
  sortBy: null,
  perPage: 10,
  checkable: false,
  paginationWithStroke: false,
};

export default Table;
