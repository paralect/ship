import React, { useState } from 'react';

import Checkbox from './index';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    text: { name: 'Text', control: 'text', defaultValue: 'Text' },
    disabled: {
      options: [true, false],
      control: { type: 'inline-radio' },
    },
    name: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    onChange: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    text: 'Text',
    disabled: false,
  },
};

const Template = (args) => {
  const [isChecked, setChecked] = useState(false);

  const handleChange = () => setChecked(!isChecked);

  return (
    <Checkbox {...args} checked={isChecked} onChange={handleChange} />
  );
};

export const Active = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
