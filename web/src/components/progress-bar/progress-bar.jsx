import React from 'react';
import PropTypes from 'prop-types';

import styles from './progress-bar.styles.pcss';

const ProgressBar = ({ percentage }) => {
  const progressStyle = {
    width: `${percentage}%`,
  };

  return (
    <div className={styles.bar}>
      <div className={styles.background} />
      <div className={styles.progress} style={progressStyle} />
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default ProgressBar;
