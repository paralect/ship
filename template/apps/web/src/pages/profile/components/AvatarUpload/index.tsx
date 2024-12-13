import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Box, Button, Center, Group, Image, Stack, Text, Title } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import cx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';

import { accountApi } from 'resources/account';

import { handleDropzoneError } from 'utils';

import { USER_AVATAR } from 'app-constants';
import { UpdateUserParamsFrontend } from 'types';

import classes from './index.module.css';

const AvatarUpload = () => {
  const [imageSrc, setImageSrc] = useState<string | null | undefined>(undefined);

  const { data: account } = accountApi.useGet();

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<UpdateUserParamsFrontend>();

  const avatarValue = watch('avatar');
  const avatarError = errors.avatar?.message;

  useEffect(() => {
    if (typeof avatarValue === 'string') {
      setImageSrc('');
      return;
    }

    const imageUrl = avatarValue ? URL.createObjectURL(avatarValue) : account?.avatarUrl;

    setImageSrc(imageUrl);
  }, [avatarValue]);

  return (
    <Stack>
      <Group align="flex-start" gap={32}>
        <Stack align="center" gap={12}>
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <Dropzone
                accept={USER_AVATAR.ACCEPTED_FILE_TYPES}
                maxSize={USER_AVATAR.MAX_FILE_SIZE}
                onDrop={([imageFile]) => field.onChange(imageFile)}
                onReject={handleDropzoneError}
                multiple={false}
                classNames={classes}
                {...field}
              >
                <Center
                  className={cx(classes.browseButton, {
                    [classes.imageExists]: !!imageSrc,
                  })}
                >
                  {imageSrc ? (
                    <Box pos="relative" w="100%" h="100%">
                      <Image
                        component={NextImage}
                        src={imageSrc}
                        alt="Avatar"
                        pos="absolute"
                        sizes="100px"
                        priority
                        fill
                      />

                      <Center w="100%" h="100%" pos="absolute" className={classes.editOverlay}>
                        <IconPencil size={32} stroke={1} className={classes.pencilIcon} />
                      </Center>
                    </Box>
                  ) : (
                    <IconPlus size={32} stroke={1} className={classes.addIcon} />
                  )}
                </Center>
              </Dropzone>
            )}
          />

          {(avatarValue || imageSrc === '') && (
            <Button variant="subtle" size="sm" onClick={() => setValue('avatar', undefined, { shouldDirty: true })}>
              Reset
            </Button>
          )}

          {account?.avatarUrl && avatarValue === undefined && (
            <Button variant="subtle" size="sm" onClick={() => setValue('avatar', '', { shouldDirty: true })}>
              Remove
            </Button>
          )}
        </Stack>

        <Stack gap={4}>
          <Title order={4}>Profile picture</Title>

          <Stack gap={0} c="gray.6">
            <Text>JPG, JPEG or PNG</Text>
            <Text>Max size = 5 MB</Text>
          </Stack>
        </Stack>
      </Group>

      {avatarError && <Text c="red.6">{avatarError}</Text>}
    </Stack>
  );
};

export default AvatarUpload;
