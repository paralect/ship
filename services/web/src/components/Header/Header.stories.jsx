import { ActivateCardIcon } from 'public/icons';

import Header from './Header';

const MENU_ITEMS = [
  {
    handler: () => {},
    label: 'Dashboard',
    icon: () => <ActivateCardIcon />,
  },
  {
    handler: () => {},
    label: 'Subscription',
    icon: () => <ActivateCardIcon />,
  },
  {
    handler: () => {},
    label: 'Profile',
    icon: () => <ActivateCardIcon />,
    options: [
      {
        handler: () => {},
        label: 'Dashboard',
      },
      {
        handler: () => {},
        label: 'Subscription',
      },
      {
        handler: () => {},
        label: 'Profile',
      },
    ],
  },
];

export default {
  title: 'Components/Header',
  component: Header,
};

const Template = (args) => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
  fullName: 'Bachrimchuk Unknown',
};

export const WithAvatar = Template.bind({});
WithAvatar.args = {
  fullName: 'Bachrimchuk Unknown',
  avatarSrc: 'https://www.jigsawplanet.com/daniel1212?rc=face',
};

export const WithMenu = Template.bind({});
WithMenu.args = {
  menu: MENU_ITEMS,
  fullName: 'Bachrimchuk Unknown',
  avatarSrc: 'https://www.jigsawplanet.com/daniel1212?rc=face',
};
