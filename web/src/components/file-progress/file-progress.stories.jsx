import React from 'react';

import FileProgress from './index';

export default {
  title: 'Components/FileProgress',
  component: FileProgress,
};

const Template = (args) => <FileProgress {...args} />;

export const InProgress = Template.bind({});
InProgress.args = {
  percentage: 55,
  fileName: 'some-file-name.exe',
  fileSize: '25mB',
};

export const Success = Template.bind({});
Success.args = {
  percentage: 55,
  fileName: 'some-file-name.exe',
  fileSize: '25mB',
  status: 'success',
};

export const Fail = Template.bind({});
Fail.args = {
  percentage: 55,
  fileName: 'some-file-name.exe',
  fileSize: '25mB',
  status: 'fail',
};
