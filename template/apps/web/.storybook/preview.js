import { MantineProvider } from '@mantine/core';
import { addDecorator } from '@storybook/react';
import { withThemes } from '@react-theming/storybook-addon';
import shipTheme from '../src/theme/ship-theme';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

addDecorator(withThemes(MantineProvider, [shipTheme]));
