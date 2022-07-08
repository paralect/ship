import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import queryClient from 'query-client';
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
        <NotificationsProvider autoClose={10000}>
          <PageConfig>
            <Component {...pageProps} />
          </PageConfig>
        </NotificationsProvider>
        <ReactQueryDevtools position="bottom-right" />
      </MantineProvider>
    </QueryClientProvider>
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
