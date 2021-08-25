import React from 'react';

import Avatar from './index';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      options: ['xl', 'l', 'm', 's', 'xs'],
      control: { type: 'radio' },
    },
    fullName: 'text',
    src: 'text',
  },
  args: {
    fullName: 'Bachrimchuk Unknown',
  },
};

const Template = (args) => <Avatar {...args} />;

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
  size: 'xl',
};

export const Large = Template.bind({});
Large.args = {
  size: 'l',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'm',
};

export const Small = Template.bind({});
Small.args = {
  size: 's',
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  size: 'xs',
};

export const WithPicture = Template.bind({});
WithPicture.args = {
  size: 'xl',
  src: 'https://www.jigsawplanet.com/daniel1212?rc=face',
};
