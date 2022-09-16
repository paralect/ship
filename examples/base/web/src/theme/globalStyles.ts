import { CSSObject, MantineTheme } from '@mantine/core';

export const globalStyles = (theme: MantineTheme): CSSObject => ({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  body: {
    ...theme.fn.fontStyles(),
  },
});
