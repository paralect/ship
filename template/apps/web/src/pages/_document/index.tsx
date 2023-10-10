import { createGetInitialProps } from '@mantine/next';
import { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

Document.getInitialProps = getInitialProps;

export default Document;
