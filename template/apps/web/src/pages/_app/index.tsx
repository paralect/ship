import { FC } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import queryClient from 'query-client';
import theme from 'theme';

import PageConfig from './PageConfig';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications autoClose={10000} />

          <PageConfig>
            <Component {...pageProps} />
          </PageConfig>
        </ModalsProvider>
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </MantineProvider>
    </QueryClientProvider>
  </>
);

export default App;
