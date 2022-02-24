import { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './MemoCard.module.css';

const types = {
  info: 'info',
  alert: 'alert',
  error: 'error',
};

const MemoCard = ({ title, items, type }) => {
  if (!items) return null;

  if (!Array.isArray(items)) {
    return (
      <div className={cn(styles.memoCard, styles[type])}>
        {title}
        {items.message}
      </div>
    );
  }

  const data = items?.filter((e) => e !== undefined);

  if (!data.length) return null;

  return (
    <div className={cn(styles.memoCard, styles[type])}>
      {title}
      <ul>
        {data.map((item) => (
          <li key={item.message}>{item.message}</li>
        ))}
      </ul>
    </div>
  );
};

MemoCard.propTypes = {
  title: PropTypes.string,
  items: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.object,
  ]),
  type: PropTypes.oneOf(Object.values(types)),
};

MemoCard.defaultProps = {
  title: null,
  items: [],
  type: 'error',
};

export default memo(MemoCard);
