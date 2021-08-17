import React, { useState } from 'react';

import RadioButton from './index';

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
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
    <RadioButton {...args} value={isChecked} onChange={handleChange} />
  );
};

export const Active = Template.bind({});
Active.args = {
  disabled: false,
  label: 'Label',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  label: 'Label',
};
