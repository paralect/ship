import { memo, useState } from 'react';
import { Group, Text, Button, Stack } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconPencil, IconPlus } from '@tabler/icons-react';

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
      <Stack>
        <Group align="flex-start" spacing={32}>
          <Stack align="center" spacing={10}>
            <Dropzone
              name="avatarUrl"
              accept={['image/png', 'image/jpg', 'image/jpeg']}
              onDrop={handlePhotoUpload}
              classNames={{
                root: classes.dropzoneRoot,
              }}
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
            {account.avatarUrl && (
              <Button
                type="submit"
                variant="subtle"
                onClick={handlerPhotoRemove}
                size="sm"
              >
                Remove
              </Button>
            )}
          </Stack>
          <Stack spacing={4} pt={6}>
            <Text weight={600} size="lg">Profile picture</Text>
            <Text className={classes.text}>
              JPG, JPEG or PNG
              Max size = 2MB
            </Text>
          </Stack>
        </Group>
      </Stack>
      {!!errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
    </>
  );
};

export default memo(PhotoUpload);
