import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import queryClient from 'query-client';
import shipTheme from 'theme/ship-theme';

import PageConfig from './PageConfig';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={shipTheme}
        defaultProps={{
          Button: { size: 'md' },
          TextInput: { size: 'md' },
          PasswordInput: { size: 'md' },
          Select: { size: 'md' },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider autoClose={10000}>
            <PageConfig>
              <Component {...pageProps} />
            </PageConfig>
          </NotificationsProvider>
        </ModalsProvider>
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
