import React from 'react';

import ButtonLink from './index';

export default {
  title: 'Components/ButtonLink',
  component: ButtonLink,
  argTypes: {
    disabled: {
      options: [true, false],
      control: { type: 'radio' },
    },
    href: 'text',
    text: 'text',
  },
  args: {
    text: 'Text',
  },
};

const Template = ({ ...args }) => <ButtonLink {...args}>{args.children}</ButtonLink>;

export const Active = Template.bind({});
Active.args = {
  href: 'https://www.paralect.com/',
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: 'arrow',
  href: 'https://www.paralect.com/',
};
