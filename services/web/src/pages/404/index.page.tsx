import { useCallback } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { NextPage } from 'next';

import * as routes from 'routes';
import {
  Stack,
  Title,
  Text,
  Button,
} from '@mantine/core';

const NotFound: NextPage = () => {
  const handleClick = useCallback(() => {
    router.push(routes.path.home);
  }, []);

  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Oops! The page is not found.</Title>
        <Text
          component="p"
          sx={(theme) => ({
            color: theme.colors.gray[5],
            margin: '20px 0 24px',
          })}
        >
          The page you are looking for may have been removed,
          or the link you followed may be broken.
        </Text>
        <Button
          type="submit"
          onClick={handleClick}
        >
          Go to homepage
        </Button>
      </Stack>
    </>
  );
};

export default NotFound;
