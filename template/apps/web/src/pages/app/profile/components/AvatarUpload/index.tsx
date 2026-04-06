import { FC } from 'react';
import Image from 'next/image';
import { useApiQuery } from 'hooks';
import { Pencil, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { AccountUpdateParams, USER_AVATAR } from 'shared';

import { apiClient } from 'services/api-client.service';
import { handleDropzoneError } from 'utils';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type UpdateUserFormData = AccountUpdateParams;

const ACCEPT_TYPES = USER_AVATAR.ACCEPTED_FILE_TYPES.reduce(
  (acc, type) => {
    acc[type] = [];
    return acc;
  },
  {} as Record<string, string[]>,
);

interface AvatarDropzoneProps {
  imageSrc: string | null | undefined;
  onChange: (file: File) => void;
}

const AvatarDropzone: FC<AvatarDropzoneProps> = ({ imageSrc, onChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: ACCEPT_TYPES,
    maxSize: USER_AVATAR.MAX_FILE_SIZE,
    onDrop: ([imageFile]) => onChange(imageFile),
    onDropRejected: handleDropzoneError,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex h-[100px] w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50',
        imageSrc && 'border-solid border-transparent',
      )}
    >
      <input {...getInputProps()} />

      {imageSrc ? (
        <>
          <Image src={imageSrc} alt="Avatar" fill sizes="100px" priority className="rounded-full object-cover" />

          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <Pencil className="h-8 w-8 text-white" strokeWidth={1} />
          </div>
        </>
      ) : (
        <Plus className="h-8 w-8 text-muted-foreground" strokeWidth={1} />
      )}
    </div>
  );
};

const AvatarUpload = () => {
  const { data: account } = useApiQuery(apiClient.account.get);

  const {
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
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-8">
        <div className="flex flex-col items-center gap-3">
          <AvatarDropzone imageSrc={imageSrc} onChange={(file) => setValue('avatar', file, { shouldDirty: true })} />

          {(avatarValue || imageSrc === '') && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setValue('avatar', undefined, { shouldDirty: true })}
            >
              Reset
            </Button>
          )}

          {account?.avatarUrl && avatarValue === undefined && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setValue('avatar', '', { shouldDirty: true })}
            >
              Remove
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="font-semibold">Profile picture</h4>

          <div className="text-sm text-muted-foreground">
            <p>JPG, JPEG or PNG</p>
            <p>Max size = 5 MB</p>
          </div>
        </div>
      </div>

      {avatarError && <p className="text-sm text-destructive">{String(avatarError)}</p>}
    </div>
  );
};

export default AvatarUpload;
