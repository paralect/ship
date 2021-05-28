import PropTypes from 'prop-types';

import styles from './SearchInfo.module.css';

const SearchInfo = ({ count, perPage, page }) => {
  const start = perPage * (page + 1) - perPage + 1;
  let end = perPage * (page + 1);
  if (end > count) end = count;

  return (
    <div>
      Showing
      {' '}
      <span className={styles.mediumText}>{start}</span>
      {' '}
      to
      {' '}
      <span className={styles.mediumText}>{end}</span>
      {' '}
      of
      {' '}
      <span className={styles.mediumText}>{count}</span>
      {' '}
      results
    </div>
  );
};

SearchInfo.propTypes = {
  count: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default SearchInfo;
