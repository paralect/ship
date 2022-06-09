import { memo, useState } from 'react';
import cn from 'classnames';

import { Button } from 'components';
import { handleError } from 'helpers';
import { userApi } from 'resources/user';
import { AddIcon, PenIcon } from 'public/icons';

import styles from './FileUpload.module.css';

const PhotoUpload = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const { data: currentUser } = userApi.useGetCurrent();

  const { mutate: uploadProfilePhoto } = userApi.useUploadProfilePhoto({
    onError: (err) => handleError(err),
  });
  const { mutate: removeProfilePhoto } = userApi.useRemoveProfilePhoto({
    onError: (err) => handleError(err),
  });

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

  const handlePhotoUpload = async (e) => {
    const imageFile = e.target.files[0];

    setErrorMessage(null);

    if (isFileFormatCorrect(imageFile) && isFileSizeCorrect(imageFile) && imageFile) {
      const body = new FormData();
      body.append('file', imageFile, imageFile.name);

      await uploadProfilePhoto(body, {
        onError: (err) => handleError(err),
      });
    }
  };

  const handlerPhotoRemove = async () => {
    setErrorMessage(null);
    await removeProfilePhoto();
  };

  return (
    <>
      <p className={styles.uploadPhotoText}>Profile picture</p>
      <div className={styles.photoContainer}>
        <label
          className={cn(styles.browseButton, {
            [styles.error]: errorMessage,
          })}
        >
          {currentUser.avatarUrl ? (
            <div
              className={styles.avatar}
              style={{
                backgroundImage: `url(${currentUser.avatarUrl}`,
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
            onChange={handlePhotoUpload}
          />
        </label>
        <span className={styles.buttonContainer}>
          <p className={styles.text}>
            JPG, JPEG or PNG
            Max size = 2MB
          </p>
          {currentUser.avatarUrl && (
            <Button
              type="text"
              htmlType="submit"
              className={styles.removeButton}
              onClick={handlerPhotoRemove}
              size="s"
            >
              Remove
            </Button>
          )}
        </span>
      </div>
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
    </>
  );
};

export default memo(PhotoUpload);
