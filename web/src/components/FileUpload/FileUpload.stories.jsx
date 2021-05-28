import React from 'react';
import { Provider } from 'react-redux';

import useToast from 'hooks/use-toast';

import store from 'resources/store';

import ToastProvider from 'components/Toast/ToastProvider';
import Button from 'components/Button';

import FileUpload from './FileUpload';

import styles from './FileUpload.stories.css';

export default {
  title: 'Components/File Upload',
  component: FileUpload,
  argTypes: {
    size: {
      options: ['m'],
      control: { type: 'radio' },
    },
    _error: {
      message: { name: 'Error', control: 'text', defaultValue: null },
    },
    error: {
      table: {
        disable: true,
      },
    },
    maxFiles: {
      table: {
        disable: true,
      },
    },
    handleSubmit: {
      table: {
        disable: true,
      },
    },
    SubmitButtonComponent: {
      table: {
        disable: true,
      },
    },
    getUploadParams: {
      table: {
        disable: true,
      },
    },
    setDocumentsCount: {
      table: {
        disable: true,
      },
    },
    getDocumentUrl: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    size: 'm',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
        <ToastProvider />
      </Provider>
    ),
  ],
};

const Template = (args) => {
  const { toastSuccess } = useToast();

  const handleSubmit = (event, allFiles) => {
    toastSuccess('File(s) successfully uploaded, check console logs');
    // eslint-disable-next-line no-console
    console.log(allFiles);
  };

  const getUploadParams = () => ({ url: 'https://httpbin.org/post' });

  // eslint-disable-next-line react/prop-types
  const SubmitButtonComponent = ({ onSubmit, disabled }) => (
    <Button
      onClick={onSubmit}
      disabled={disabled}
      className={styles.submitButton}
    >
      Submit documents
    </Button>
  );
  return (
    <div className={styles.container}>
      <FileUpload
        {...args}
        handleSubmit={handleSubmit}
        SubmitButtonComponent={SubmitButtonComponent}
        getUploadParams={getUploadParams}
      />
    </div>
  );
};

export const Active = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  _error: {
    message: 'Error message',
  },
};
