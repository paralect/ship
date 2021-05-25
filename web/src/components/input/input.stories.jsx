import React from 'react';

import Input from './index';

export default {
  title: 'Components/Input',
  component: Input,
  decorators: [(Story) => <div style={{ 'max-width': '400px' }}><Story /></div>],
};

const Template = (args) => <Input {...args} />;

export const PrimaryEmpty = Template.bind({});
PrimaryEmpty.args = {
  value: '',
};

export const PrimaryFilled = Template.bind({});
PrimaryFilled.args = {
  value: 'Some text',
};

export const ErrorEmpty = Template.bind({});
ErrorEmpty.args = {
  value: '',
  errors: ['Field is required.'],
};

export const ErrorFilled = Template.bind({});
ErrorFilled.args = {
  value: 'Some text',
  errors: ['Field is required.'],
};

export const Text = Template.bind({});
Text.args = {
  type: 'text',
  value: 'Some text',
};

export const Search = Template.bind({});
Search.args = {
  type: 'search',
  value: 'query',
};

export const Email = Template.bind({});
Email.args = {
  type: 'email',
  value: 'example@gmail.com',
};

export const Number = Template.bind({});
Number.args = {
  type: 'number',
  value: '42',
};

export const Password = Template.bind({});
Password.args = {
  type: 'password',
  value: 'qwerty123',
};

export const Url = Template.bind({});
Url.args = {
  type: 'url',
  value: 'google.com',
};
