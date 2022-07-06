import { createGetInitialProps } from '@mantine/next';
import { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

const Document = () => (
  <Html>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

Document.getInitialProps = getInitialProps;

export default Document;
