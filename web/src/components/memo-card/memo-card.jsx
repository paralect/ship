import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './memo-card.styles.pcss';

const MemoCard = ({
  title, items, type,
}) => {
  return (
    <div
      className={cn(styles.memoCard, styles[type])}
    >
      {title}
      <ul>
        {items.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
};

MemoCard.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
};

MemoCard.defaultProps = {
  title: '',
  items: [],
  type: 'info',
};

export default React.memo(MemoCard);
