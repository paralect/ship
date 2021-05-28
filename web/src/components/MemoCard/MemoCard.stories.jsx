import React from 'react';

import MemoCard from './index';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

export default {
  title: 'Components/Memo',
  component: MemoCard,
  argTypes: {
    title: { name: 'Title', control: 'text' },
    type: {
      name: 'Type',
      options: ['info', 'alert', 'error'],
      control: {
        type: 'inline-radio',
        labels: {
          info: 'Info',
          alert: 'Alert',
          error: 'Error',
        },
      },
    },
    items: {
      table: {
        disable: true,
      },
    },
  },

  args: {
    items,
  },
};

const Template = (args) => <MemoCard {...args} />;

export const Info = Template.bind({});
Info.args = {
  title: 'Info memo title',
  type: 'info',
};

export const Alert = Template.bind({});
Alert.args = {
  title: 'Alert memo title',
  type: 'alert',
};

export const Error = Template.bind({});
Error.args = {
  title: 'Error memo title',
  type: 'error',
};
