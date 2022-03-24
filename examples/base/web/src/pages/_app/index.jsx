import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PropTypes from 'prop-types';
import Head from 'next/head';

import queryClient from 'query-client';
import { Toaster } from 'components';

import PageConfig from './PageConfig';

import 'styles/globals.css';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>
    <QueryClientProvider client={queryClient}>
      <PageConfig>
        <Component {...pageProps} />
      </PageConfig>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
    <Toaster />
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
