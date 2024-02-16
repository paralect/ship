import { NextPage } from 'next';
import Head from 'next/head';
import router from 'next/router';
import { Stack, Title, Text, Button } from '@mantine/core';

import { RoutePath } from 'routes';

const NotFound: NextPage = () => (
  <>
    <Head>
      <title>Page not found</title>
    </Head>

    <Stack
      h="100vh"
      w={328}
      justify="center"
      m="auto"
    >
      <Title order={2}>Oops! The page is not found.</Title>

      <Text mx={0} mt={20} mb={24} c="gray.6">
        The page you are looking for may have been removed,
        or the link you followed may be broken.
      </Text>

      <Button onClick={() => router.push(RoutePath.Home)}>
        Go to homepage
      </Button>
    </Stack>
  </>
);

export default NotFound;
