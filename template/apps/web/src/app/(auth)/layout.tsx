'use client';

import { FC, ReactNode } from 'react';
import { Center, Image, SimpleGrid } from '@mantine/core';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
      <Image h="100vh" src="/images/ship.svg" alt="App Info" visibleFrom="sm" />

      <Center component="main" h="100vh" w="100%" px={32}>
        {children}
      </Center>
    </SimpleGrid>
  );
};

export default AuthLayout;
