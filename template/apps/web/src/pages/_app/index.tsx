import { FC } from 'react';
import { AppProps } from 'next/app';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Head from 'next/head';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import queryClient from 'query-client';

import GlobalErrorHandler from './GlobalErrorHandler';

import 'globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <div className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
    <Head>
      <title>Ship</title>
    </Head>

    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Component {...pageProps} />
        </TooltipProvider>

        <GlobalErrorHandler />

        <Toaster richColors position="top-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ThemeProvider>
  </div>
);

export default App;
