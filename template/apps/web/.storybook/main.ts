import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  framework: '@storybook/nextjs',
  addons: ['@storybook/addon-controls', '@storybook/addon-styling-webpack', 'storybook-dark-mode'],
  stories: [
    {
      directory: '../src/components',
      titlePrefix: 'Application components',
    },
    {
      directory: '../src/theme/components',
      titlePrefix: 'UI Kit',
    },
  ],
};

export default config;
