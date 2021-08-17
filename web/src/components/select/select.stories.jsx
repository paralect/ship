import React, { useState } from 'react';

import Select from './index';

const options = [
  {
    value: '1',
    label: 'One',
  },
  {
    value: '2',
    label: 'Two',
  },
  {
    value: '3',
    label: 'Three',
  },
  {
    value: '4',
    label: 'Four',
  },
  {
    value: '5',
    label: 'Five',
  },
];

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    disabled: {
      options: [true, false],
      control: { type: 'radio' },
    },
    error: {
      message: { name: 'Error', control: 'text', defaultValue: null },
    },
    label: { name: 'Label', control: 'text', defaultValue: 'Label' },
  },
  args: {
    disabled: false,
  },
};

const Template = (args) => {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '400px' }}>
      <Select
        {...args}
        value={value}
        onChange={setValue}
        options={options}
      />
    </div>
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
