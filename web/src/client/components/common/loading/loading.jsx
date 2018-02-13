import React from 'react';
import PropTypes from 'prop-types';

import styles from './loading.styles.pcss';

const Loading = (props) => {
  if (props.error) {
    return <div>Error!</div>;
  } else if (props.pastDelay) {
    return (
      <div className={styles.cubeWrapper}>
        <div className={styles.cubeFolding}>
          <span className={styles.leaf1} />
          <span className={styles.leaf2} />
          <span className={styles.leaf3} />
          <span className={styles.leaf4} />
        </div>
        <span className={styles.loading} data-name="Loading">
          Loading
        </span>
      </div>
    );
  }
  return null;
};

Loading.propTypes = {
  error: PropTypes.bool,
  pastDelay: PropTypes.bool,
};

Loading.defaultProps = {
  error: false,
  pastDelay: true,
};

export default Loading;
