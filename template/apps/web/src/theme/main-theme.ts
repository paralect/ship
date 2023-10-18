import { Button, Image, PasswordInput, Select, TextInput, createTheme } from '@mantine/core';

const mainTheme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '600',
  },
  lineHeights: {
    md: '1.45',
  },
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
    Button: Button.extend({
      defaultProps: {
        size: 'lg',
      },
      styles: {
        label: {
          fontWeight: 500,
        },
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: 'lg',
      },
      styles: {
        input: {
          fontSize: 16,

          // '&::placeholder, &:disabled, &:disabled::placeholder': {
          //   color: '#6d747b !important',
          // },
        },
        // invalid: {
        //   color: theme.colors.gray[9],

        //             '&, &:focus-within': {
        //               borderColor: theme.colors.red[6],
        //             },
        // },
        label: {
          fontSize: 18,
          fontWeight: 600,
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: 'lg',
        styles: {
          innerInput: {
            fontSize: '16px !important',

            // '&::placeholder': {
            //   color: '#6d747b',
            // },
          },
          label: {
            fontSize: 18,
            fontWeight: 600,
          },
          // invalid: {
          //   input: {
          //     '&::placeholder': {
          //       color: theme.colors.red[6],
          //     },
          //   },
          // },
        },
      },
    }),
    Select: Select.extend({
      defaultProps: { size: 'md' },
    }),
    Image: Image.extend({
      styles: {
        root: {
          objectPosition: 'left !important',
        },
      },
    }),
  },
});

export default mainTheme;
