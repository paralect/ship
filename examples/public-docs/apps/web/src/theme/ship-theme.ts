import { MantineTheme, MantineThemeOverride } from '@mantine/core';

const shipTheme: MantineThemeOverride = {
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 600,
  },
  lineHeight: 1.45,
  primaryColor: 'blue',
  primaryShade: 6,
  other: {
    transition: {
      speed: {
        fast: '200ms',
        smooth: '300ms',
        slow: '400ms',
        slowest: '1000ms',
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        easeInBack: 'cubic-bezier(0.82,-0.2, 0.32, 1.84)',
        easeOutBack: 'cubic-bezier(0.5,-1.18, 0.51, 1.11)',
        easeInOutBack: 'cubic-bezier(.64,-0.56,.34,1.55)',
      },
    },
  },
  components: {
    Button: {
      defaultProps: { size: 'lg' },
      styles: () => ({
        label: {
          fontWeight: 500,
        },
      }),
    },
    TextInput: {
      defaultProps: {
        size: 'lg',
      },
      styles: (theme: MantineTheme) => ({
        input: {
          fontSize: '16px',

          '&::placeholder, &:disabled, &:disabled::placeholder': {
            color: '#6d747b !important',
          },
        },
        invalid: {
          color: theme.colors.gray[9],

          '&, &:focus-within': {
            borderColor: theme.colors.red[6],
          },
        },
        label: {
          fontSize: '18px',
          fontWeight: 600,
        },
      }),
    },
    PasswordInput: {
      defaultProps: { size: 'lg' },
      styles: (theme: MantineTheme) => ({
        root: {
          input: {
            fontSize: '16px !important',

            '&::placeholder': {
              color: '#6d747b',
            },
          },
        },
        label: {
          fontSize: '18px',
          fontWeight: 600,
        },
        invalid: {
          input: {
            '&::placeholder': {
              color: theme.colors.red[6],
            },
          },
        },
      }),
    },
    Select: {
      defaultProps: { size: 'md' },
    },
    Image: {
      styles: () => ({
        image: {
          objectPosition: 'left !important',
        },
      }),
    },
  },
};

export default shipTheme;
