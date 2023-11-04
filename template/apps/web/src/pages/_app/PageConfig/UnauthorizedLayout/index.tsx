import { FC, ReactElement } from 'react';

import { SimpleGrid, Image, Center } from '@mantine/core';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <SimpleGrid
    cols={{ base: 1, sm: 2 }}
    spacing="sm"
  >
    <Image
      visibleFrom="sm"
      alt="App Info"
      src="/images/ship.svg"
      h="100vh"
    />

    <Center px={32} w="100%" h="100vh" component="main">
      {children}
    </Center>
  </SimpleGrid>
);

export default UnauthorizedLayout;
