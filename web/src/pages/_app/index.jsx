import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';

import store from 'resources/store';
import { userActions } from 'resources/user/user.slice';

import ToasterProvider from 'components/Toast/ToastProvider';

import PageConfig from './PageConfig';

import 'styles/globals.css';

const App = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await store.dispatch(userActions.getCurrent());
      } catch (error) {
        // @todo: add something like sentry
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Ship</title>
      </Head>
      <Provider store={store}>
        <ToasterProvider />
        <PageConfig>
          <Component {...pageProps} />
        </PageConfig>
      </Provider>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
