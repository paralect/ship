import React, { useState } from 'react';

import Switch from './index';

export default {
  title: 'Components/Switch',
  component: Switch,
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
    <Switch {...args} value={isChecked} onChange={handleChange} />
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
