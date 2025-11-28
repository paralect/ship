import { ComboboxItem } from '@mantine/core';

export const getSortByOptions = (isMobile: boolean): ComboboxItem[] => {
  return [
    {
      value: 'newest',
      label: 'Newest',
    },
    {
      value: 'oldest',
      label: 'Oldest',
    },
    ...(isMobile
      ? [
          {
            value: 'firstName',
            label: 'First Name',
          },
          {
            value: 'lastName',
            label: 'Last Name',
          },
          {
            value: 'email',
            label: 'Email',
          },
        ]
      : []),
  ];
};
