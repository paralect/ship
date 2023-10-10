import { FC } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { Global, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import queryClient from 'query-client';
import shipTheme from 'theme/ship-theme';
import { globalStyles } from 'theme/globalStyles';

import PageConfig from './PageConfig';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={shipTheme}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <Global styles={globalStyles} />
          <Notifications autoClose={10000} />

          <PageConfig>
            <Component {...pageProps} />
          </PageConfig>
        </ModalsProvider>
        <ReactQueryDevtools position="bottom-right" />
      </MantineProvider>
    </QueryClientProvider>
  </>
);

export default App;
