import React, { useState } from 'react';

import Select from './index';

const options = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
  {
    label: 'Option 3',
    value: '3',
  },
  {
    label: 'Option 4',
    value: '4',
  },
  {
    label: 'Option 5',
    value: '5',
  },
  {
    label: 'Option 6',
    value: '6',
  },
  {
    label: 'Option 7',
    value: '7',
  },
  {
    label: 'Option 8',
    value: '8',
  },
];

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    label: { name: 'Label', control: 'text', defaultValue: 'Label' },
    placeholder: { name: 'Placeholder', control: 'text', defaultValue: 'Select...' },
    disabled: {
      options: [true, false],
      control: { type: 'inline-radio' },
      defaultValue: false,
    },
    isMulti: {
      name: 'Is multi',
      options: [true, false],
      control: { type: 'inline-radio' },
      defaultValue: false,
    },
    error: {
      message: { name: 'Error', control: 'object', defaultValue: null },
    },
    name: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [(Story) => <div style={{ maxWidth: '400px' }}><Story /></div>],
};

const Template = (args) => {
  const [value, setValue] = useState('');

  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      {...args}
    />
  );
};

export const Active = Template.bind({});

export const Multi = Template.bind({});
Multi.args = {
  isMulti: true,
};

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
