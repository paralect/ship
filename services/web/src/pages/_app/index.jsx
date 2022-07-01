import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';

import queryClient from 'query-client';
import { Toaster } from 'components';

import PageConfig from './PageConfig';
import shipTheme from 'theme/ship-theme';
import components from 'theme/components';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={shipTheme}
        styles={components}
        withGlobalStyles
        withNormalizeCSS
      >
        <PageConfig>
          <Component {...pageProps} />
        </PageConfig>
        <ReactQueryDevtools position="bottom-right" />
        <Toaster />
      </MantineProvider>
    </QueryClientProvider>
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
