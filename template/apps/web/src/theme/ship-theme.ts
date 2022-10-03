import { MantineTheme, MantineThemeOverride } from '@mantine/core';

const shipTheme: MantineThemeOverride = {
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  },
  primaryColor: 'dark',
  primaryShade: 9,
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
      defaultProps: { size: 'md' },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
      styles: (theme: MantineTheme) => ({
        invalid: {
          color: theme.colors.gray[9],
        },
      }),
    },
    PasswordInput: {
      defaultProps: { size: 'md' },
    },
    Select: {
      defaultProps: { size: 'md' },
    },
  },
};

export default shipTheme;
