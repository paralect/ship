import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <ColorSchemeScript defaultColorScheme="auto" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
