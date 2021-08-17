import React from 'react';

import Icon from 'components/icon';

import ButtonMenu from './index';

const OPTIONS = [{
  label: 'Option 1',
  handler: () => console.log('1'),
  icon: () => <Icon icon="copy" />,
},
{
  label: 'Option 2',
  handler: () => console.log('2'),
  icon: () => <Icon icon="copy" />,
},
{
  label: 'Option 3',
  handler: () => console.log('3'),
},
{
  label: 'Option 4',
  handler: () => console.log('4'),
},
{
  label: 'Option 5',
  handler: () => console.log('5'),
},
];

export default {
  title: 'Components/ButtonMenu',
  component: ButtonMenu,
  argTypes: {
    onClick: { action: 'clicked' },
    children: { name: 'Text', control: 'text', defaultValue: 'ButtonMenu' },
  },
};

const Template = ({ ...args }) => <ButtonMenu {...args}>{args.children}</ButtonMenu>;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  options: OPTIONS,
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  options: OPTIONS,
};

export const Text = Template.bind({});
Text.args = {
  type: 'text',
  options: OPTIONS,
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  options: OPTIONS,
};
