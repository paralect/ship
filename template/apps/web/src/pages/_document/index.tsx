import { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      <ColorSchemeScript defaultColorScheme="auto" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
