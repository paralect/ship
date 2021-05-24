import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from 'routes';

import styles from './notFound.styles.pcss';

function NotFound() {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <p>Ah shit, here we go again.</p>
      <p>
        <Link to={routes.home.url()}>
          Back to home
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
