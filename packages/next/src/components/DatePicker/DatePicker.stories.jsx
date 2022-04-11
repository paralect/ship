import { useState } from 'react';

import DatePicker from './index';

export default {
  title: 'Components/Date Picker',
  component: DatePicker,
  argTypes: {
    label: { name: 'Label', control: 'text', defaultValue: 'Label' },
    placeholder: { name: 'Placeholder', control: 'text', defaultValue: 'Placeholder Text' },
    disabled: {
      options: [true, false],
      control: { type: 'inline-radio' },
    },
    error: {
      message: { name: 'Error', control: 'text', defaultValue: null },
    },
    control: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    label: 'Label',
    disabled: false,
  },
  decorators: [(Story) => <div style={{ maxWidth: '400px' }}><Story /></div>],
};

const Template = (args) => {
  const [value, setValue] = useState('');

  return <DatePicker value={value} onChange={setValue} {...args} />;
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
