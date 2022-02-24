import { CopyIcon } from 'public/icons';

import ComboButton from './ComboButton';

const options = [{
  label: () => (
    <>
      <CopyIcon />
      Option 1
    </>
  ),
  onClick: () => console.log('1'),
},
{
  label: 'Option 2',
  onClick: () => console.log('2'),
},
{
  label: 'Option 3',
  onClick: () => console.log('3'),
},
{
  label: 'Option 4',
  onClick: () => console.log('4'),
},
{
  label: 'Option 5',
  onClick: () => console.log('5'),
},
];

export default {
  title: 'Components/Combo Button',
  component: ComboButton,
  argTypes: {
    children: { name: 'Text', control: 'text', defaultValue: 'Combo Button' },
    disabled: {
      name: 'Disabled',
      options: [true, false],
      control: { type: 'boolean' },
    },
    type: {
      name: 'Type',
      options: ['primary', 'secondary', 'text'],
      control: {
        type: 'inline-radio',
        labels: {
          primary: 'Primary',
          secondary: 'Secondary',
          text: 'Text',
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
    loading: {
      table: {
        disable: true,
      },
    },
    options: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    loading: false,
    disabled: false,
    size: 'm',
    options,
  },
};

const Template = ({ ...args }) => <ComboButton {...args}>{args.children}</ComboButton>;

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
