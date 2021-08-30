import React, { useState } from 'react';

import CheckBox from './index';

export default {
  title: 'Components/CheckBox',
  component: CheckBox,
  argTypes: {
    disabled: {
      options: [true, false],
      control: { type: 'radio' },
    },
    text: 'text',
  },
  args: {
    text: 'Text',
  },
};

const Template = (args) => {
  const { value } = args;
  const [isChecked, setChecked] = useState(value);

  const handleChange = () => setChecked(!isChecked);

  return (
    <CheckBox {...args} value={isChecked} onChange={handleChange} />
  );
};

export const Active = Template.bind({});
Active.args = {
  disabled: false,
  label: 'Checkbox',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  label: 'Checkbox',
};
