import { CSSVariablesResolver } from '@mantine/core';

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-transition-speed-fast': theme.other.transition.speed.fast,
    '--mantine-transition-speed-smooth': theme.other.transition.speed.smooth,
    '--mantine-transition-speed-slow': theme.other.transition.speed.slow,
    '--mantine-transition-speed-slowest': theme.other.transition.speed.slowest,

    '--mantine-transition-easing-linear': theme.other.transition.easing.linear,
    '--mantine-transition-easing-ease': theme.other.transition.easing.ease,
    '--mantine-transition-easing-easeIn': theme.other.transition.easing.easeIn,
    '--mantine-transition-easing-easeOut': theme.other.transition.easing.easeOut,
    '--mantine-transition-easing-easeInOut': theme.other.transition.easing.easeInOut,
    '--mantine-transition-easing-easeInBack': theme.other.transition.easing.easeInBack,
    '--mantine-transition-easing-easeOutBack': theme.other.transition.easing.easeOutBack,
    '--mantine-transition-easing-easeInOutBack': theme.other.transition.easing.easeInOutBack,
  },

  // Variables that depend on color scheme
  light: {},
  dark: {},
});

export default resolver;
