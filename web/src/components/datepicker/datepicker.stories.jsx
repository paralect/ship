import React, { useState } from 'react';

import Datepicker from './index';

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
  title: 'Components/Datepicker',
  component: Datepicker,
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
      <Datepicker
        {...args}
        value={value}
        onChange={setValue}
        options={options}
      />
    </div>
  );
};

export const Active = Template.bind({});
Active.args = {
  placeholder: 'Placeholder',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  placeholder: 'Placeholder',
};

export const Error = Template.bind({});
Error.args = {
  errors: ['Error message'],
  placeholder: 'Placeholder',
};
