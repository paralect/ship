'use client';

import { FC, ReactNode, useEffect } from 'react';
import { AppShell, Stack } from '@mantine/core';

import { accountApi } from 'resources/account';

import { Header } from 'components';

import { socketService } from 'services';

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout: FC<PrivateLayoutProps> = ({ children }) => {
  const { data: account } = accountApi.useGet();

  useEffect(() => {
    if (account) socketService.connect();

    return () => socketService.disconnect();
  }, []);

  if (!account) return null;

  return (
    <AppShell component={Stack} bg="gray.0">
      <Header />

      <AppShell.Main p={32} pt={104}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default PrivateLayout;
