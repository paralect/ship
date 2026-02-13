import { FC } from 'react';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import queryClient from 'query-client';

import GlobalErrorHandler from './GlobalErrorHandler';
import PageConfig from './PageConfig';

import 'globals.css';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <div className={`${inter.variable} font-sans`}>
    <Head>
      <title>Ship</title>
    </Head>

    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PageConfig>
          <Component {...pageProps} />
        </PageConfig>
      </TooltipProvider>

      <GlobalErrorHandler />

      <Toaster richColors position="top-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  </div>
);

export default App;
