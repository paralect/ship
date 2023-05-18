import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import {
  type GetObjectOutput,
  type CopyObjectOutput,
  type DeleteObjectOutput,
  type CompleteMultipartUploadOutput,
} from '@aws-sdk/client-s3';
import { type File } from '@koa/multer';

import config from 'config';

import * as helpers from './cloud-storage.helper';

const client = new S3Client(config.cloudStorage);
const Bucket = config.cloudStorage.bucket;

const upload = (fileName: string, file: File): Promise<CompleteMultipartUploadOutput> => {
  const params = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
    ACL: 'private',
  };

  const multipartUpload = new Upload({
    client,
    params,
  });

  return multipartUpload.done();
};

const uploadPublic = (fileName: string, file: File): Promise<CompleteMultipartUploadOutput> => {
  const params = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: fileName,
    ACL: 'public-read',
  };

  const multipartUpload = new Upload({
    client,
    params,
  });

  return multipartUpload.done();
};

const getSignedDownloadUrl = (fileName: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket,
    Key: fileName,
  });

  return getSignedUrl(client, command, { expiresIn: 1800 });
};

const getObject = (fileName: string): Promise<GetObjectOutput> => {
  const command = new GetObjectCommand({
    Bucket,
    Key: fileName,
  });

  return client.send(command);
};

const copyObject = (filePath: string, copyFilePath: string): Promise<CopyObjectOutput> => {
  const command = new CopyObjectCommand({
    Bucket,
    CopySource: encodeURI(`${Bucket}/${copyFilePath}`),
    Key: filePath,
  });

  return client.send(command);
};

const deleteObject = (fileName: string): Promise<DeleteObjectOutput> => {
  const command = new DeleteObjectCommand( {
    Bucket,
    Key: fileName,
  });

  return client.send(command);
};

export default {
  helpers,
  upload,
  uploadPublic,
  getObject,
  copyObject,
  deleteObject,
  getSignedDownloadUrl,
};
