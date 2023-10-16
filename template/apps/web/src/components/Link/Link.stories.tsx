import { IconUserCircle } from '@tabler/icons-react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

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
    underline: {
      name: 'Underline',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    inherit: {
      name: 'Inherit',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    icon: {
      table: {
        disable: true,
      },
    },
    inNewTab: {
      name: 'In new tab',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: true,
    },
    size: {
      name: 'Size',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: {
        type: 'inline-radio',
        labels: {
          xs: 'Extra small',
          sm: 'Small',
          md: 'Medium',
          lg: 'Large',
          xl: 'Extra large',
        },
      },
      defaultValue: 'md',
    },
  },
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = ({ ...args }) => (
  <Link {...args}>
    {args.children}
  </Link>
);

export const Icon = Template.bind({});

Icon.args = {
  icon: <IconUserCircle />,
};
