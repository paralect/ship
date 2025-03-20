import { Button, ButtonProps } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: Button,
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
  },
  argTypes: {
    variant: {
      options: ['primary', 'outline'],
      control: { type: 'radio' },
    },
    size: {
      options: ['md', 'lg'],
      control: { type: 'radio' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<ButtonProps>;

export const Basic: Story = {};
