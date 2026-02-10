import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en">
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <body className="min-h-screen bg-background font-sans antialiased">
      <Main />

      <NextScript />
    </body>
  </Html>
);

export default Document;
