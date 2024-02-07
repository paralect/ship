import { createTheme } from '@mantine/core';

import * as components from './components';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '600',
  },
  primaryColor: 'dark',
  components,
});

export default theme;
