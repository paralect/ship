'use client';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { GlobalErrorHandler } from 'components';

import theme from 'theme';

import queryClient from 'query-client';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <ModalsProvider>{children}</ModalsProvider>

        <GlobalErrorHandler />

        <Notifications autoClose={10000} />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default Providers;
