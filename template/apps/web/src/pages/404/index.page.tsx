import { useCallback } from 'react';
import Head from 'next/head';
import router from 'next/router';
import { NextPage } from 'next';
import { Stack, Title, Text, Button } from '@mantine/core';

import { RoutePath } from 'routes';

const NotFound: NextPage = () => {
  const handleClick = useCallback(() => {
    router.push(RoutePath.Home);
  }, []);

  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <Stack
        m="auto"
        w={328}
        h="100vh"
        justify="center"
        display="flex"
      >
        <Title order={2}>Oops! The page is not found.</Title>

        <Text mx={0} mt={20} mb={24} c="gray.6">
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
