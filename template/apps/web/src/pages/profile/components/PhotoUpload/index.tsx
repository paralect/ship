import { memo, useState } from 'react';
import { Group, Text, Button, Stack, BackgroundImage, Center } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import cx from 'clsx';

import { accountApi } from 'resources/account';

import { handleError } from 'utils';

import classes from './index.module.css';

const ONE_MB_IN_BYTES = 1048576;

const PhotoUpload = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: account } = accountApi.useGet();

  const { mutate: uploadProfilePhoto } = accountApi.useUploadAvatar<FormData>();
  const { mutate: removeProfilePhoto } = accountApi.useRemoveAvatar();

  if (!account) return null;

  const isFileSizeCorrect = (file: any) => {
    if ((file.size / ONE_MB_IN_BYTES) > 2) {
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

      uploadProfilePhoto(body, {
        onError: (err) => handleError(err),
      });
    }
  };

  const handlerPhotoRemove = async () => {
    setErrorMessage(null);
    removeProfilePhoto();
  };

  return (
    <>
      <Stack>
        <Group align="flex-start" gap={32}>
          <Stack align="center" gap={10}>
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
                  <BackgroundImage
                    className={classes.avatar}
                    w={88}
                    h={88}
                    src={account.avatarUrl}
                  >
                    <Center
                      className={classes.innerAvatar}
                      w="100%"
                      h="100%"
                      bg="#10101099"
                      c="gray.2"
                    >
                      <IconPencil />
                    </Center>
                  </BackgroundImage>
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

          <Stack gap={4} pt={6}>
            <Text fw={600} size="lg">Profile picture</Text>

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
