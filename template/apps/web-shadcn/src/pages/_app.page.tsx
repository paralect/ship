import { FC } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import queryClient from 'query-client';

import 'globals.css';

import { Toaster } from '@/components/ui/sonner';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>

    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />

      <Toaster richColors position="top-right" />

      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  </>
);

export default App;
