import bold from './fonts/Inter-Bold.woff';
import bold2 from './fonts/Inter-Bold.woff2';
import regular from './fonts/Inter-Regular.woff';
import regular2 from './fonts/Inter-Regular.woff2';
import medium from './fonts/Inter-Medium.woff';
import medium2 from './fonts/Inter-Medium.woff2';
export const globalStyles = (theme) => ([
  {
    '@font-face': {
      fontFamily: 'Inter',
      src: `
        url('${bold}') format("woff"),
        url('${bold2}') format("woff2")
      `,
      fontWeight: 700,
      fontStyle: 'normal',
      fontDisplay: 'swap',
    },
  },
  {
    '@font-face': {
      fontFamily: 'Inter',
      src: `
        url('${regular}') format("woff"),
        url('${regular2}') format("woff2")
      `,
      fontWeight: 400,
      fontStyle: 'normal',
      fontDisplay: 'swap',
    },
  },
  {
    '@font-face': {
      fontFamily: 'Inter',
      src: `
        url('${medium}') format("woff"),
        url('${medium2}') format("woff2")
      `,
      fontWeight: 500,
      fontStyle: 'normal',
      fontDisplay: 'swap',
    },
  },
  {
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    body: {
      ...theme.fn.fontStyles(),
    },
  },
]);