import NextImage from 'next/image';
import { Box, Button, Center, Group, Image, Stack, Text, Title } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import cx from 'clsx';
import { z } from 'zod';
import { Controller, useFormContext } from 'react-hook-form';

import { apiClient } from 'services/api-client.service';

import { useApiQuery } from 'hooks/use-api.hook';

import { handleDropzoneError } from 'utils';

import { USER_AVATAR } from 'shared';
import { updateUserSchema } from 'shared';

import classes from './index.module.css';

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

const AvatarUpload = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<UpdateUserFormData>();

  const avatarValue = watch('avatar');
  const avatarError = errors.avatar?.message;

  let imageSrc: string | null | undefined = account?.avatarUrl;

  if (typeof avatarValue === 'string') imageSrc = '';
  else if (avatarValue) imageSrc = URL.createObjectURL(avatarValue as Blob);

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

      {avatarError && <Text c="red.6">{String(avatarError)}</Text>}
    </Stack>
  );
};

export default AvatarUpload;
