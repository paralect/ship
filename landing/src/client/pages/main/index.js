import React from 'react';

import Layout from '../../layouts/main';
import styles from './styles.css';

export default () => (
  <Layout>
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Your brand new landing website</h1>
          <p className={styles.description}>
            That opens the door into the future.<br />
            It is impossible to imagine how the humanity used to live before.
          </p>
        </div>
        <div className={styles.logo}>
          <div>Stack.</div>
        </div>
      </div>
    </div>
  </Layout>
);
