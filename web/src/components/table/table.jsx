import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import Checkbox from 'components/checkbox';

import TableHeadCell from './table-head-cell/table-head-cell';
import TableFooter from './table-footer/table-footer';
import styles from './table.styles.pcss';

const Table = (props) => {
  const {
    columns, items, checkable, onUpdate,
    pageSize, totalPages,
    itemsCount, totalCount,
  } = props;
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);

  const allChecked = items.every((item) => {
    return checkedItems.some((checkedItem) => checkedItem.id === item.id);
  });

  const fullWidth = columns.reduce((sum, col) => {
    return sum + Number(col.width.replace('%', ''));
  }, 0);

  if (fullWidth !== 100) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Table full width !== 100:', fullWidth); // eslint-disable-line no-console
    }
  }

  function handleSortBy(newSortBy) {
    setSortBy(newSortBy);
  }

  function handleGoToPage(selectedPage) {
    setPage(selectedPage);
  }

  useEffect(() => {
    onUpdate(page, pageSize, sortBy?.field, sortBy?.direction);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, page]);

  function handleAllCheck() {
    if (allChecked) {
      setCheckedItems(differenceBy(checkedItems, items));
    } else {
      setCheckedItems([...checkedItems, ...items]);
    }
  }

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
    function handleItemCheck() {
      const changedItem = items.find((i) => i.id === id);
      if (!checked) {
        const mergedItems = [...checkedItems, changedItem];
        setCheckedItems(mergedItems);
      } else {
        const filteredItems = checkedItems.filter((i) => i.id !== id);
        setCheckedItems(filteredItems);
      }
    }

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
          pageSize={pageSize}
          page={page}
          totalPages={totalPages}
          itemsCount={itemsCount}
          totalCount={totalCount}
          onGoToPage={handleGoToPage}
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
            noSort={column.noSort}
          />
        ))}
      </div>
      {renderBody()}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    width: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortBy: PropTypes.shape({
    field: PropTypes.string,
    direction: PropTypes.number,
  }),
  checkable: PropTypes.bool,
  onUpdate: PropTypes.func,
  pageSize: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  itemsCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

Table.defaultProps = {
  sortBy: null,
  checkable: false,
  onUpdate: noop,
};

export default Table;
