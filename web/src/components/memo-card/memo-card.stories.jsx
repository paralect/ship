import React from 'react';

import MemoCard from 'components/memo-card';

export default {
  title: 'Components/Memo',
  component: MemoCard,
  args: {
    items: ['#1 item', '#2 item'],
  },
};

const Template = (args) => {
  return (
    <MemoCard {...args} />
  );
};

export const Info = Template.bind({});
Info.args = {
  title: 'Info memo title',
  type: 'info',
};

export const Warning = Template.bind({});
Warning.args = {
  title: 'Warning memo title',
  type: 'warning',
};

export const Error = Template.bind({});
Error.args = {
  title: 'Error memo title',
  type: 'error',
};
