import React, { useState } from 'react';

import SearchInput from './index';

export default {
  title: 'Components/SearchInput',
  component: SearchInput,
  decorators: [(Story) => <div style={{ maxWidth: '400px' }}><Story /></div>],
};

const Template = ({ ...args }) => {
  const [value, setValue] = useState('');

  // eslint-disable-next-line no-console
  const apiRequestFunction = (val) => console.log(val);

  return (
    <SearchInput
      {...args}
      label="Label"
      placeholder="placeholder"
      apiHandler={apiRequestFunction}
      value={value}
      onChange={setValue}
    />
  );
};

export const Empty = Template.bind({});
Empty.args = {
  value: '',
  label: 'Label',
};

export const Error = Template.bind({});
Error.args = {
  value: '',
  label: 'Label',
  errors: ['Field is required.'],
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  value: 'Some text',
  label: 'Label',
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: 'Placeholder',
  label: 'Label',
};
