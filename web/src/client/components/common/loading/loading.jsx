// @flow

import React from 'react';
import type { Node } from 'react';

import styles from './loading.styles.pcss';

const Loading = (): Node => {
  return (
    <div className={styles.cubeWrapper}>
      <div className={styles.cubeFolding}>
        <span className={styles.leaf1} />
        <span className={styles.leaf2} />
        <span className={styles.leaf3} />
        <span className={styles.leaf4} />
      </div>
      <span className={styles.loading} data-name="Loading">
        {'Loading'}
      </span>
    </div>
  );
};

export default Loading;
