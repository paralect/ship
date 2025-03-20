import { Inter } from 'next/font/google';
import { createTheme, DEFAULT_THEME } from '@mantine/core';

import * as components from './components';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  fontFamily: inter.style.fontFamily,
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: `${inter.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
    fontWeight: '600',
  },
  primaryColor: 'dark',
  components,
});

export default theme;
