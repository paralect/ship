/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import { uploadProfilePhoto, removeProfilePhoto } from 'resources/user/user.api';
import { userSelectors } from 'resources/user/user.slice';

import useHandleError from 'hooks/use-handle-error';

import { AddIcon, PenIcon } from 'public/icons';

import Button from 'components/Button';

import styles from './styles.module.css';

const PhotoUpload = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const handleError = useHandleError();

  const user = useSelector(userSelectors.selectUser);

  const isFileSizeCorrect = (file) => {
    const oneMBinBytes = 1048576;
    if ((file.size / oneMBinBytes) > 2) {
      setErrorMessage('Sorry, you cannot upload a file larger than 2 MB.');
      return false;
    }
    return true;
  };

  const isFileFormatCorrect = (file) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) return true;
    setErrorMessage('Sorry, you can only upload JPG, JPEG or PNG photos.');
    return false;
  };

  const handleImageUpload = useCallback(async (e) => {
    const imageFile = e.target.files[0];

    try {
      setErrorMessage(null);

      if (isFileFormatCorrect(imageFile) && isFileSizeCorrect(imageFile) && imageFile) {
        const body = new FormData();
        body.append('file', imageFile, imageFile.name);

        await uploadProfilePhoto(body);
      }
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const handleClick = useCallback(async () => {
    try {
      setErrorMessage(null);
      await removeProfilePhoto();
    } catch (e) {
      handleError(e);
    }
  }, [handleError]);

  return (
    <>
      <p className={styles.uploadPhotoText}>Profile picture</p>
      <div className={styles.photoContainer}>
        <label
          className={cn(styles.browseButton, {
            [styles.error]: errorMessage,
          })}
        >
          {user.avatarUrl ? (
            <div
              className={styles.avatar}
              style={{
                backgroundImage: `url(${user.avatarUrl}`,
              }}
            >
              <div className={styles.innerAvatar}>
                <PenIcon />
              </div>
            </div>
          )
            : <AddIcon className={styles.addIcon} />}
          <input
            name="avatarUrl"
            style={{ display: 'none' }}
            type="file"
            onChange={(e) => handleImageUpload(e)}
          />
        </label>
        <span className={styles.buttonContainer}>
          <p className={styles.text}>
            JPG, JPEG or PNG
            Max size = 2MB
          </p>
          {user.avatarUrl && (
            <Button
              type="text"
              htmlType="submit"
              className={styles.removeButton}
              onClick={handleClick}
              size="s"
            >
              Remove
            </Button>
          )}
        </span>
      </div>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </>
  );
};

export default PhotoUpload;
