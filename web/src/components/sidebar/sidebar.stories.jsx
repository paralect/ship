import React from 'react';

import Sidebar from './index';

const MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'lightning',
    path: '/dashboard',
  },
  {
    label: 'Subscriptions',
    icon: 'lightning',
    path: '/subscriptions',
  },
  {
    label: 'Projects',
    icon: 'lightning',
    path: '/projects',
  },
  {
    label: 'Profile',
    icon: 'lightning',
    path: '/profie',
  },
];

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
};

const Template = (args) => {
  const [currentPage, setCurrentPage] = React.useState(MENU_ITEMS[0]);

  return (
    <Sidebar
      {...args}
      pages={MENU_ITEMS}
      currentPage={currentPage}
      onChange={setCurrentPage}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  fullName: 'Bachrimchuk Unknown',
};
