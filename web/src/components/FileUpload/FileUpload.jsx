import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone-uploader-with-credentials';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';

import addPostfix from 'helpers/file-upload/add-postfix';

import Input from './Input';
import Layout from './Layout';
import Preview from './Previews';

import styles from './FileUpload.module.css';

const sizes = {
  m: styles.m,
};

const FileUpload = ({
  size,
  _error,
  maxFiles,
  handleSubmit,
  SubmitButtonComponent,
  setDocumentsCount,
  getUploadParams,
}) => {
  const [error, setError] = useState({});
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

  useEffect(() => {
    if (_error) setError(_error);
  }, [_error]);

  const handleChangeStatus = (file, status, allFiles) => {
    switch (status) {
      case 'preparing': {
        setError({});
        setSubmitButtonDisabled(true);
        if (setDocumentsCount) setDocumentsCount(allFiles.length);
        addPostfix(allFiles);
        break;
      }
      case 'rejected_max_files': {
        setError({ message: `Sorry, you cannot upload more than ${maxFiles} files.` });
        setSubmitButtonDisabled(false);
        break;
      }
      case 'error_file_size': {
        file.remove();
        setError({ message: 'Sorry, you cannot upload files larger than 25 MB.' });
        setSubmitButtonDisabled(false);
        break;
      }
      case 'done': {
        if (allFiles.some((f) => f.meta.status !== 'done' || f.meta.status !== 'error_upload_params')) setSubmitButtonDisabled(false);
        break;
      }
      case 'error_upload_params': {
        if (!file.file.size) setSubmitButtonDisabled(false);
        break;
      }
      case 'removed': {
        if (setDocumentsCount) setDocumentsCount(allFiles.length - 1);
        break;
      }
      default:
        break;
    }
  };

  const getFilesFromEvent = async (e) => {
    const chosenFiles = await getDroppedOrSelectedFiles(e);
    return chosenFiles.map((f) => f.fileObject);
  };

  return (
    <div className={cn(sizes[size])}>
      <Dropzone
        getUploadParams={getUploadParams}
        onSubmit={handleSubmit}
        onChangeStatus={handleChangeStatus}
        getFilesFromEvent={getFilesFromEvent}
        SubmitButtonComponent={SubmitButtonComponent}
        PreviewComponent={(props) => <Preview {...props} />}
        InputComponent={(props) => <Input {...props} error={error} />}
        LayoutComponent={(props) => <Layout {...props} error={error} />}
        submitButtonDisabled={submitButtonDisabled}
        maxFiles={maxFiles}
        maxSizeBytes={25_000_000}
      />
    </div>
  );
};

FileUpload.propTypes = {
  size: PropTypes.string,
  _error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  maxFiles: PropTypes.number,
  SubmitButtonComponent: PropTypes.func,
  handleSubmit: PropTypes.func,
  getUploadParams: PropTypes.func,
  setDocumentsCount: PropTypes.func,
};

FileUpload.defaultProps = {
  size: sizes.m,
  _error: null,
  maxFiles: 5,
  handleSubmit: null,
  SubmitButtonComponent: null,
  getUploadParams: null,
  setDocumentsCount: null,
};

export default memo(FileUpload);
