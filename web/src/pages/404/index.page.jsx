import { useCallback } from 'react';
import Head from 'next/head';

import { routes } from 'config';
import router from 'next/router';

import Button from 'components/Button';

import styles from './styles.module.css';

const NotFound = () => {
  const handleClick = useCallback(() => {
    router.push(routes.path.home);
  }, []);

  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <div className={styles.container}>
        <h2>Oops! The page is not found.</h2>
        <p className={styles.error}>
          The page you are looking for may have been removed,
          or the link you followed may be broken.
        </p>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleClick}
        >
          Go to homepage
        </Button>
      </div>
    </>
  );
};

export default NotFound;
