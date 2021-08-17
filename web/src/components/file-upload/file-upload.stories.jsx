import React from 'react';

import FileUpload from './index';

export default {
  title: 'Components/FileUpload',
  component: FileUpload,
};

const Template = (args) => <FileUpload {...args} />;

export const Main = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Some error text',
};
