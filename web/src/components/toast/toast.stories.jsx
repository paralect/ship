import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from 'resources/store';

import { toastActions } from 'resources/toast/toast.slice';
import Button from 'components/button';

export default {
  title: 'Components/Toaster',
  component: Button,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export const Template = () => {
  const dispatch = useDispatch();

  const showSuccessToast = () => {
    dispatch(toastActions.success('This is success toast! This is success toast!'));
  };

  const showErrorToast = () => {
    dispatch(toastActions.error('This is error toast! This is error toast!'));
  };

  const showInfoToast = () => {
    dispatch(toastActions.info('This is info toast! This is info toast!'));
  };

  const showWarningToast = () => {
    dispatch(toastActions.warning('This is warning toast! This is warning toast!'));
  };

  return (
    <p>
      <Button
        onClick={showSuccessToast}
      >
        success toast
      </Button>
      <Button
        onClick={showErrorToast}
      >
        error toast
      </Button>
      <Button
        onClick={showInfoToast}
      >
        info toast
      </Button>
      <Button
        onClick={showWarningToast}
      >
        warning toast
      </Button>
    </p>
  );
};
