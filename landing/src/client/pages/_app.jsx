import React from 'react';
import App from 'next/app';

class MyApp extends App {
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);

    return { ...appProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps /* eslint-disable-line react/jsx-props-no-spreading */} />;
  }
}

export default MyApp;
