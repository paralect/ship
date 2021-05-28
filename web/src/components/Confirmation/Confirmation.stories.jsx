import React from 'react';
import { Provider } from 'react-redux';

import store from 'resources/store';

import useToast from 'hooks/use-toast';

import Avatar from 'components/Avatar';
import Button from 'components/Button';
import ToastProvider from 'components/Toast/ToastProvider';
import styles from './Confirmation.stories.css';

import { confirm } from './index';

export default {
  title: 'Components/Confirmation',
  controls: { hideNoControlsWarning: true },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
        <ToastProvider />
      </Provider>
    ),
  ],
};

export const Basic = () => {
  const { toastSuccess } = useToast();

  const basicDialog = async (args) => {
    const isConfirmed = await confirm({
      ...args,
      heading: 'Delete',
      subheading: 'Deleting',
      body: 'Are you sure you want to delete this document ? It will be deleted immediately, you can not undo this action',
    });

    if (isConfirmed) {
      toastSuccess('Deleted successfully');
    }
  };

  return <Button onClick={basicDialog}>Basic dialog</Button>;
};

export const CustomBody = () => {
  const { toastError } = useToast();

  const user = {
    fullName: 'Bachrimchuk Unknown',
    avatarUrl: 'https://i.ibb.co/RvDN9gG/photo-2021-11-12-10-16-15.jpg',
  };

  const customDialog = async (args) => {
    const isConfirmed = await confirm({
      ...args,
      heading: 'Delete user',
      submitButtonText: 'Delete',
      withoutBodyMargins: true,
      body: () => (
        <>
          <div className={styles.profileContainer}>
            <Avatar
              src={user.avatarUrl}
              fullName={user.fullName}
            />
            <div className={styles.profile}>
              <div className={styles.fullName}>
                {user.fullName}
              </div>
              <a
                href="https://www.instagram.com/bachrimchuk/"
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                View profile
              </a>
            </div>
          </div>
          <div className={styles.description}>
            Are you sure you want to delete this user?
            It will be deleted immediately, you can not undo this action.
          </div>
        </>
      ),
    });

    if (isConfirmed) {
      toastError('Sorry, but you cannot delete user with status "Legend"');
    }
  };

  return <Button onClick={customDialog}>Dialog with custom body</Button>;
};
