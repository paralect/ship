import Head from 'next/head';
import { useState } from 'react';

import { LayoutType, Page, ScopeType } from 'components';
import { useApiMutation } from 'hooks';
import { apiClient } from 'services/api-client.service';

import { Dropzone } from '@/components/ui/dropzone';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  key: string;
  url: string;
  name: string;
}

const FilesPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);

  const uploadMutation = useApiMutation(apiClient.files.upload, {
    onSuccess: (data) => {
      const file = files[0];
      setUploaded((prev) => [...prev, { ...data, name: file?.name || data.key }]);
      setFiles([]);
    },
  });

  const removeMutation = useApiMutation(apiClient.files.remove, {
    onSuccess: (_, variables) => {
      setUploaded((prev) => prev.filter((f) => f.key !== variables.key));
    },
  });

  const handleUpload = () => {
    if (files.length === 0) return;
    uploadMutation.mutate({ file: files[0] });
  };

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      <Head>
        <title>Files</title>
      </Head>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">File Upload</h1>

        <div className="mb-6 space-y-4">
          <Dropzone
            value={files}
            onChange={setFiles}
            maxFiles={1}
            maxSize={10 * 1024 * 1024}
          />

          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>

          {uploadMutation.isError && (
            <p className="text-sm text-destructive">
              Upload failed: {uploadMutation.error?.message || 'Unknown error'}
            </p>
          )}
        </div>

        {uploaded.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Uploaded Files</h2>
            <ul className="space-y-2">
              {uploaded.map((file) => (
                <li
                  key={file.key}
                  className="flex items-center justify-between rounded-md border border-border bg-card p-3"
                >
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="truncate text-sm font-medium text-card-foreground">{file.name}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-xs text-muted-foreground hover:underline"
                    >
                      {file.url}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMutation.mutate({ key: file.key })}
                    disabled={removeMutation.isPending}
                    className="ml-2 shrink-0 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Page>
  );
};

export default FilesPage;
