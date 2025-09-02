import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import PageConfig from 'app/page-config';
import Providers from 'app/providers';

import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/dropzone/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

export const metadata = {
  title: 'Ship',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>

      <body>
        <Providers>
          <PageConfig>{children}</PageConfig>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
