import React from 'react';

import Input from './index';

export default {
  title: 'Components/Input',
  component: Input,
  decorators: [(Story) => <div style={{ maxWidth: '400px' }}><Story /></div>],
};

const Template = (args) => <Input {...args} />;

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

export const Email = Template.bind({});
Email.args = {
  type: 'email',
  value: 'example@gmail.com',
  label: 'Email',
};

export const Password = Template.bind({});
Password.args = {
  type: 'password',
  value: 'qwerty123',
  label: 'Password',
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: 'Placeholder',
  label: 'Label',
};
