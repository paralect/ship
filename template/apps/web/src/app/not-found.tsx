import Link from 'next/link';
import { Button, Stack, Text, Title } from '@mantine/core';

export const metadata = {
  title: 'Page not found',
};

const NotFoundPage = () => {
  return (
    <Stack h="100vh" w={328} justify="center" m="auto">
      <Title order={2}>Oops! The page is not found.</Title>

      <Text mx={0} mt={20} mb={24} c="gray.6">
        The page you are looking for may have been removed, or the link you followed may be broken.
      </Text>

      <Button component={Link} href="/profile">
        Go to homepage
      </Button>
    </Stack>
  );
};

export default NotFoundPage;
