import React from 'react';

import Icon from 'components/icon';

import Button from './index';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    onClick: { action: 'clicked' },
    children: { name: 'Text', control: 'text', defaultValue: 'Button' },
  },
};

const Template = ({ ...args }) => <Button {...args}>{args.children}</Button>;
const TemplateWithIcon = ({ ...args }) => (
  <Button {...args}>
    <Icon icon="copy" />
    {args.children}
  </Button>
);

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
};

export const Text = Template.bind({});
Text.args = {
  type: 'text',
};

export const Loading = Template.bind({});
Loading.args = {
  type: 'primary',
  isLoading: true,
};

export const WithIcon = TemplateWithIcon.bind({});
Loading.args = {
  type: 'primary',
};
