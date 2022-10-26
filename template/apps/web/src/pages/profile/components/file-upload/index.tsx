import { memo, useState } from 'react';
import { Group, Text, Button } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconPencil, IconPlus } from '@tabler/icons';

import { handleError } from 'utils';
import { accountApi } from 'resources/account';

import { useStyles } from './styles';

const PhotoUpload = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { classes, cx } = useStyles();

  const { data: account } = accountApi.useGet();

  const { mutate: uploadProfilePhoto } = accountApi.useUploadAvatar<FormData>();
  const { mutate: removeProfilePhoto } = accountApi.useRemoveAvatar();

  if (!account) return null;

  const isFileSizeCorrect = (file: any) => {
    const oneMBinBytes = 1048576;
    if ((file.size / oneMBinBytes) > 2) {
      setErrorMessage('Sorry, you cannot upload a file larger than 2 MB.');
      return false;
    }
    return true;
  };

  const isFileFormatCorrect = (file: FileWithPath) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) return true;
    setErrorMessage('Sorry, you can only upload JPG, JPEG or PNG photos.');
    return false;
  };

  const handlePhotoUpload = async ([imageFile]: FileWithPath[]) => {
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
      <Text weight={500}>Profile picture</Text>
      <Group align="center">
        <Dropzone
          name="avatarUrl"
          accept={['image/png', 'image/jpg', 'image/jpeg']}
          onDrop={handlePhotoUpload}
          styles={() => ({
            root: {
              border: 'none',
              borderRadius: 0,
              padding: 0,
              backgroundColor: 'transparent',
            },
          })}
        >
          <label
            className={cx(classes.browseButton, {
              [classes.error]: errorMessage,
            })}
          >
            {account.avatarUrl ? (
              <div
                className={classes.avatar}
                style={{
                  backgroundImage: `url(${account.avatarUrl})`,
                }}
              >
                <div className={classes.innerAvatar}>
                  <IconPencil />
                </div>
              </div>
            ) : <IconPlus className={classes.addIcon} />}
          </label>
        </Dropzone>
        <span className={classes.buttonContainer}>
          <p className={classes.text}>
            JPG, JPEG or PNG
            Max size = 2MB
          </p>
          {account.avatarUrl && (
            <Button
              type="submit"
              variant="subtle"
              className={classes.removeButton}
              onClick={handlerPhotoRemove}
              size="sm"
            >
              Remove
            </Button>
          )}
        </span>
      </Group>
      {!!errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
    </>
  );
};

export default memo(PhotoUpload);
