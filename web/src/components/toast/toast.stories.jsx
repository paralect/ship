import React from 'react';
import { Provider } from 'react-redux';
import store from 'resources/store';

import useToast from 'hooks/useToast';
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
  const {
    toastSuccess, toastInfo, toastError, toastWarning,
  } = useToast();

  const showSuccessToast = () => {
    toastSuccess('This is success toast! This is success toast!');
  };

  const showErrorToast = () => {
    toastError('This is error toast! This is error toast!');
  };

  const showInfoToast = () => {
    toastInfo('This is info toast! This is info toast!');
  };

  const showWarningToast = () => {
    toastWarning('This is warning toast! This is warning toast!');
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
