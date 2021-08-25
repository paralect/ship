import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import styles from './status-tag.styles.pcss';

const STATUSES = {
  positive: 'positive',
  negative: 'negative',
  neutral: 'neutral',
};

const StatusTag = ({ status }) => {
  return (
    <div className={styles.statusTag}>
      <div className={cn(styles.mark, styles[status])} />
      {capitalize(status)}
    </div>
  );
};

StatusTag.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUSES)).isRequired,
};

export default StatusTag;
