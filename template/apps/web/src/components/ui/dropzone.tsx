'use client';

import * as React from 'react';
import { UploadCloud, X } from 'lucide-react';
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface DropzoneProps extends Omit<DropzoneOptions, 'onDrop'> {
  className?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  onReject?: (rejections: FileRejection[]) => void;
}

const Dropzone = ({ className, value = [], onChange, onReject, ...props }: DropzoneProps) => {
  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0 && onReject) {
        onReject(rejectedFiles);
      }
      if (acceptedFiles.length > 0) {
        onChange?.([...value, ...acceptedFiles]);
      }
    },
    [onChange, onReject, value],
  );

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange?.(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    ...props,
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragActive && !isDragReject && 'border-primary bg-primary/5',
          isDragReject && 'border-destructive bg-destructive/5',
          !isDragActive && 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mb-2 size-10 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">{isDragReject ? 'File type not accepted' : 'Drop files here'}</p>
        ) : (
          <>
            <p className="text-sm font-medium">Drag & drop files here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </>
        )}
      </div>

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2"
            >
              <span className="truncate text-sm">{file.name}</span>
              <Button type="button" variant="ghost" size="icon" className="size-6" onClick={() => removeFile(index)}>
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { Dropzone };
