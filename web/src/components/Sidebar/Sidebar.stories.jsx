import React from 'react';

import { ActivateCardIcon } from 'public/icons';

import Sidebar from './index';

const MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: () => <ActivateCardIcon />,
    path: '/dashboard',
  },
  {
    label: 'Subscriptions',
    icon: () => <ActivateCardIcon />,
    path: '/subscriptions',
  },
  {
    label: 'Projects',
    icon: () => <ActivateCardIcon />,
    path: '/projects',
  },
  {
    label: 'Profile',
    icon: () => <ActivateCardIcon />,
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
