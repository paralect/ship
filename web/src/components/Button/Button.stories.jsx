import React from 'react';

import { CopyIcon } from 'public/icons';

import Button from './index';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    children: { name: 'Text', control: 'text', defaultValue: 'Button' },
    loading: {
      name: 'Loading',
      options: [true, false],
      control: { type: 'boolean' },
    },
    disabled: {
      name: 'Disabled',
      options: [true, false],
      control: { type: 'boolean' },
    },
    type: {
      name: 'Type',
      options: ['primary', 'secondary', 'text', 'link'],
      control: {
        type: 'inline-radio',
        labels: {
          primary: 'Primary',
          secondary: 'Secondary',
          text: 'Text',
          link: 'Link',
        },
      },
      defaultValue: 'm',
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
    htmlType: {
      table: {
        disable: true,
      },
    },
    Icon: {
      table: {
        disable: true,
      },
    },
    withIcon: {
      table: {
        disable: true,
      },
    },
    iconPosition: {
      table: {
        disable: true,
      },
    },
    onClick: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    loading: false,
    disabled: false,
    size: 'm',
  },
};

const Template = ({ ...args }) => <Button {...args}>{args.children}</Button>;

const TemplateWithIcon = ({ ...args }) => (
  <Button {...args}>
    <CopyIcon style={{ marginRight: '4px' }} />
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

export const Link = Template.bind({});
Link.args = {
  type: 'link',
};

export const LinkWithIcon = Template.bind({});
LinkWithIcon.args = {
  type: 'link',
  withIcon: true,
};

export const WithIcon = TemplateWithIcon.bind({});
WithIcon.args = {
  type: 'primary',
};
