import React from 'react';
import { Provider } from 'react-redux';

import store from 'resources/store';

import useToast from 'hooks';

import ToastProvider from 'components/Toast/ToastProvider';
import Button from 'components/Button';

export default {
  title: 'Components/Toaster',
  component: ToastProvider,
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

const Template = () => {
  const {
    toastSuccess, toastWarning, toastError, toastInfo,
  } = useToast();

  const showSuccessToast = () => toastSuccess('This is success toast!');

  const showWarningToast = () => toastWarning('This is warning toast!');

  const showErrorToast = () => toastError('This is error toast!');

  const showInfoToast = () => toastInfo('This is info toast!');

  return (
    <>
      <h3>Call a toast</h3>
      <div style={{ marginTop: '12px' }}>
        <Button onClick={showSuccessToast} style={{ marginBottom: '8px' }}>
          Success
        </Button>
        <Button onClick={showWarningToast} style={{ marginBottom: '8px' }}>
          Warning
        </Button>
        <Button onClick={showErrorToast} style={{ marginBottom: '8px' }}>
          Error
        </Button>
        <Button onClick={showInfoToast} style={{ marginBottom: '8px' }}>
          Info
        </Button>
      </div>
    </>
  );
};

export const Default = Template.bind({});

Default.parameters = {
  controls: { hideNoControlsWarning: true },
};
