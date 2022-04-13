import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import ReactPaginate from 'react-paginate';

import { ArrowLeftIcon, ArrowRightIcon } from 'public/icons';

import SearchInfo from './SearchInfo';
import styles from './TableFooter.module.css';

const TableFooter = ({
  count, pagesCount, perPage, onPageChange,
  page, paginationWithStroke,
}) => {
  if (pagesCount <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <SearchInfo count={count} perPage={perPage} page={page} />
      <ReactPaginate
        containerClassName={cn({
          [styles.withStroke]: paginationWithStroke,
        }, styles.pagination)}
        previousLabel={<ArrowLeftIcon className={styles.arrow} />}
        previousLinkClassName={styles.prev}
        nextLabel={<ArrowRightIcon className={styles.arrow} />}
        nextLinkClassName={styles.next}
        breakLabel="..."
        breakClassName={styles.break}
        activeLinkClassName={styles.activePage}
        pageClassName={styles.page}
        disabledClassName={styles.disabled}
        pageCount={pagesCount}
        itemsCountPerPage={pagesCount}
        marginPagesDisplayed={3}
        pageRangeDisplayed={2}
        onPageChange={onPageChange}
        forcePage={page}
      />
    </div>
  );
};

TableFooter.propTypes = {
  count: PropTypes.number.isRequired,
  pagesCount: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  paginationWithStroke: PropTypes.bool.isRequired,
};
export default memo(TableFooter);
