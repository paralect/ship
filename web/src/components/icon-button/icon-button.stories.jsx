import React from 'react';

import IconButton from './index';

export default {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    onClick: { action: 'clicked' },
    children: { name: 'Text', control: 'text', defaultValue: 'IconButton' },
  },
};

const Template = ({ ...args }) => <IconButton {...args}>{args.children}</IconButton>;

export const Active = Template.bind({});
Active.args = {
  type: 'primary',
  iconLabel: 'close',
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'primary',
  disabled: true,
};
