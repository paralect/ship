import React from 'react';

import Button from './index';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    onClick: { action: 'clicked' },
    children: { name: 'Text', control: 'text', defaultValue: 'Button' },
  },
};

const Template = (args) => <Button {...args}>{args.children}</Button>;

export const Success = Template.bind({});
Success.args = {
  color: 'success',
};

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
};

export const Danger = Template.bind({});
Danger.args = {
  color: 'danger',
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
};
