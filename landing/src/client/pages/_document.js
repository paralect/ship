// ./pages/_document.js
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

import GlobalStyle from '~/styles/global';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>A brand new next.js landing website</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="shortcut icon" href="static/favicon.ico" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet" />

          <GlobalStyle />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
