import React from 'react';

import Link from './index';

export default {
  title: 'Components/Link',
  component: Link,
  argTypes: {
    children: { name: 'Text', control: 'text', defaultValue: 'Text' },
    href: { name: 'Href', control: 'text', defaultValue: 'https://www.paralect.com' },
    disabled: {
      name: 'Disabled',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    withIcon: {
      name: 'With icon',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    inNewTab: {
      name: 'In new tab',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: true,
    },
    size: {
      name: 'Size',
      options: ['s', 'm', 'l'],
      control: {
        type: 'inline-radio',
        labels: {
          s: 'Small',
          m: 'Medium',
          l: 'Large',
        },
      },
      defaultValue: 'm',
    },
    className: {
      table: {
        disable: true,
      },
    },
    Icon: {
      table: {
        disable: true,
      },
    },
  },
};

const Template = ({ ...args }) => <Link {...args}>{args.children}</Link>;

export const Active = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  withIcon: true,
};
