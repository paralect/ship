import React from 'react';

import TextArea from './index';

export default {
  title: 'Components/TextArea',
  component: TextArea,
  decorators: [(Story) => <div style={{ maxWidth: '400px' }}><Story /></div>],
};

const Template = (args) => <TextArea {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  value: '',
  label: 'Label',
};

export const Filled = Template.bind({});
Filled.args = {
  value: 'Some text',
  label: 'Label',
};

export const ErrorEmpty = Template.bind({});
ErrorEmpty.args = {
  value: '',
  label: 'Label',
  errors: ['Field is required.'],
};

export const ErrorFilled = Template.bind({});
ErrorFilled.args = {
  value: 'Some text',
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
