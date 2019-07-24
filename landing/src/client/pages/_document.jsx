// ./pages/_document.js
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { gaTrackingId },
} = getConfig();

export default class CustomDocument extends Document {
  setGoogleTags = () => {
    return {
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaTrackingId}');
      `,
    };
  };

  render() {
    return (
      <html lang="en">
        <Head>
          <title>A brand new next.js landing website</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <link rel="shortcut icon" href="static/favicon.ico" />
          <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600" rel="stylesheet" />
        </Head>

        <body>
          <Main />
          <NextScript />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
          />
          <script dangerouslySetInnerHTML={this.setGoogleTags()} />
        </body>
      </html>
    );
  }
}
