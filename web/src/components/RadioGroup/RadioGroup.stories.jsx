import React, { useState } from 'react';

import RadioGroup from './index';

export default {
  title: 'Components/Radio Group',
  component: RadioGroup,
  argTypes: {
    label: 'Label',
    disabled: {
      options: [true, false],
      control: { type: 'inline-radio' },
    },
  },
  args: {
    label: 'Label',
    disabled: false,
  },
};

const options = [
  {
    label: 'Option 1',
    value: 'option-1',
  },
  {
    label: 'Option 2',
    value: 'option-2',
  },
  {
    label: 'Option 3',
    value: 'option-3',
  },
  {
    label: 'Option 4',
    value: 'option-4',
  },
  {
    label: 'Option 5',
    value: 'option-5',
    isDisabled: true,
  },
];

const Template = (args) => {
  const [value, setValue] = useState({});

  return (
    <RadioGroup
      value={value}
      onChange={setValue}
      options={options}
      {...args}
    />
  );
};

export const Active = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
