import { useState } from 'react';

import { SearchIcon } from 'public/icons';

import Input from './index';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    label: { name: 'Label', control: 'text', defaultValue: 'Label' },
    placeholder: { name: 'Placeholder', control: 'text', defaultValue: 'Placeholder Text' },
    disabled: {
      options: [true, false],
      control: { type: 'inline-radio' },
      defaultValue: false,
    },
    maxLength: { name: 'Max Length', control: 'number' },
    iconPosition: {
      name: 'Icon position',
      options: ['left', 'right'],
      control: { type: 'inline-radio' },
      defaultValue: 'right',
    },
    error: {
      message: { name: 'Error', control: 'text', defaultValue: null },
    },
    name: { table: { disable: true } },
    className: { table: { disable: true } },
    type: { table: { disable: true } },
    control: { table: { disable: true } },
    Icon: { table: { disable: true } },
  },
  decorators: [(Story) => <div style={{ maxWidth: '400px' }}><Story /></div>],
};

const Template = (args) => {
  const [value, setValue] = useState('');

  return (
    <Input value={value} onChange={(e) => setValue(e.target.value)} {...args} />
  );
};

export const Active = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Error = Template.bind({});
Error.args = {
  error: {
    message: 'Error message',
  },
};

export const Password = Template.bind({});
Password.args = {
  type: 'password',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  Icon: SearchIcon,
};
